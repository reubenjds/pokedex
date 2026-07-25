/**
 * Fetches the Pokédex source data from PokéAPI.
 *
 *   node scripts/build-pokedex.mjs
 *
 * Writes one committed file per generation to data/gen-<n>.json. Those files are
 * the source of truth; scripts/build-assets.mjs expands them into the static
 * assets the site actually serves.
 *
 * Raw responses are projected down to just the fields we need before being
 * cached in scripts/.cache, otherwise the ~1300 /pokemon payloads (which carry
 * every move a species can learn) would run to hundreds of megabytes.
 */

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CACHE_DIR = path.join(ROOT, "scripts", ".cache");
const OUT_DIR = path.join(ROOT, "data");

const API = "https://pokeapi.co/api/v2";
const CONCURRENCY = 8;
const SPECIES_COUNT = 1025;

const GENERATIONS = {
	"generation-i": 1,
	"generation-ii": 2,
	"generation-iii": 3,
	"generation-iv": 4,
	"generation-v": 5,
	"generation-vi": 6,
	"generation-vii": 7,
	"generation-viii": 8,
	"generation-ix": 9,
};

const STAT_KEYS = {
	hp: "hp",
	attack: "attack",
	defense: "defense",
	"special-attack": "spAtk",
	"special-defense": "spDef",
	speed: "speed",
};

async function fetchJson(url, attempt = 0) {
	try {
		const response = await fetch(url);
		if (response.status === 404) return null;
		if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
		return await response.json();
	} catch (error) {
		if (attempt >= 4) throw new Error(`${url}: ${error.message}`);
		await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 500));
		return fetchJson(url, attempt + 1);
	}
}

/** Fetches `url`, projects the response, and caches the projection. */
async function load(cacheKey, url, project) {
	const cacheFile = path.join(CACHE_DIR, `${cacheKey}.json`);

	if (existsSync(cacheFile)) {
		try {
			return JSON.parse(await readFile(cacheFile, "utf8"));
		} catch (error) {
			console.warn(
				`  ignoring corrupt cache entry ${path.basename(cacheFile)}: ${error.message}`
			);
		}
	}

	const raw = await fetchJson(url);
	const projected = raw === null ? null : project(raw);

	const cacheTempFile = `${cacheFile}.${process.pid}.${Date.now()}.${Math.random()
		.toString(36)
		.slice(2)}.tmp`;

	await writeFile(cacheTempFile, JSON.stringify(projected));
	await rename(cacheTempFile, cacheFile);

	return projected;
}

async function mapWithConcurrency(items, worker) {
	const results = new Array(items.length);
	let cursor = 0;
	let done = 0;

	async function run() {
		while (cursor < items.length) {
			const index = cursor++;
			results[index] = await worker(items[index], index);

			if (++done % 100 === 0 || done === items.length) {
				process.stdout.write(`\r  ${done}/${items.length}`);
			}
		}
	}

	await Promise.all(Array.from({ length: CONCURRENCY }, run));
	process.stdout.write("\n");

	return results;
}

const idFromUrl = (url) => Number(url.replace(/\/$/, "").split("/").pop());

function titleize(slug) {
	return slug
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ");
}

function displayName(speciesName, speciesSlug, pokemonSlug, isDefault) {
	if (isDefault) return speciesName;

	const suffix = pokemonSlug.startsWith(`${speciesSlug}-`)
		? pokemonSlug.slice(speciesSlug.length + 1)
		: pokemonSlug;

	return `${speciesName} (${titleize(suffix)})`;
}

/**
 * Max stat at level 100 with 31 IVs, 252 EVs and a beneficial nature.
 * Shedinja is the one Pokémon whose HP is hard-capped at 1.
 */
function maxStat(base, isHp, slug) {
	if (isHp) return slug === "shedinja" ? 1 : 2 * base + 204;
	return Math.floor((2 * base + 99) * 1.1);
}

function projectSpecies(species) {
	return {
		id: species.id,
		slug: species.name,
		name:
			species.names.find((entry) => entry.language.name === "en")?.name ??
			titleize(species.name),
		generation: GENERATIONS[species.generation.name] ?? null,
		captureRate: species.capture_rate,
		genderRate: species.gender_rate,
		isLegendary: species.is_legendary,
		isMythical: species.is_mythical,
		evolutionChainId: species.evolution_chain
			? idFromUrl(species.evolution_chain.url)
			: null,
		varieties: species.varieties.map((variety) => ({
			slug: variety.pokemon.name,
			id: idFromUrl(variety.pokemon.url),
			isDefault: variety.is_default,
		})),
	};
}

function projectPokemon(pokemon) {
	const sprites = pokemon.sprites;
	const other = sprites.other ?? {};

	return {
		id: pokemon.id,
		slug: pokemon.name,
		types: pokemon.types
			.sort((a, b) => a.slot - b.slot)
			.map((entry) => entry.type.name),
		stats: Object.fromEntries(
			pokemon.stats.map((entry) => [STAT_KEYS[entry.stat.name], entry.base_stat])
		),
		height: pokemon.height / 10,
		weight: pokemon.weight / 10,
		abilities: pokemon.abilities
			.sort((a, b) => a.slot - b.slot)
			.map((entry) => ({
				name: titleize(entry.ability.name),
				isHidden: entry.is_hidden,
			})),
		spriteSmall:
			sprites.front_default ??
			other.home?.front_default ??
			other["official-artwork"]?.front_default ??
			null,
		spriteBig:
			other["official-artwork"]?.front_default ??
			other.home?.front_default ??
			sprites.front_default ??
			null,
	};
}

function projectEvolutionChain(chain) {
	const slugs = [];

	(function walk(node) {
		slugs.push(node.species.name);
		node.evolves_to.forEach(walk);
	})(chain.chain);

	return { id: chain.id, slugs };
}

function projectType(type) {
	const relations = type.damage_relations;

	return {
		name: type.name,
		doubleFrom: relations.double_damage_from.map((entry) => entry.name),
		halfFrom: relations.half_damage_from.map((entry) => entry.name),
		noneFrom: relations.no_damage_from.map((entry) => entry.name),
	};
}

/** Damage multiplier taken from every attacking type, per defending type. */
function buildDefenceChart(types) {
	const chart = {};

	for (const type of types) {
		const multipliers = Object.fromEntries(types.map((other) => [other.name, 1]));

		for (const attacker of type.doubleFrom) multipliers[attacker] = 2;
		for (const attacker of type.halfFrom) multipliers[attacker] = 0.5;
		for (const attacker of type.noneFrom) multipliers[attacker] = 0;

		chart[type.name] = multipliers;
	}

	return chart;
}

/**
 * Defensive matchups, matching the semantics of the original CSV importer:
 * anything that deals reduced damage counts as "strong against", anything
 * that deals double or more counts as "weak against".
 */
function matchups(chart, typeNames, pokemonTypes) {
	const strongAgainst = [];
	const weakAgainst = [];

	for (const attacker of typeNames) {
		const multiplier = pokemonTypes.reduce(
			(total, defender) => total * (chart[defender]?.[attacker] ?? 1),
			1
		);

		if (multiplier < 1) strongAgainst.push(attacker);
		else if (multiplier >= 2) weakAgainst.push(attacker);
	}

	return { strongAgainst, weakAgainst };
}

function genderPercents(genderRate) {
	if (genderRate < 0) return { malePercent: 0, femalePercent: 0 };

	const femalePercent = (genderRate / 8) * 100;

	return {
		malePercent: Number((100 - femalePercent).toFixed(1)),
		femalePercent: Number(femalePercent.toFixed(1)),
	};
}

async function main() {
	await mkdir(CACHE_DIR, { recursive: true });

	console.log("Fetching type chart...");
	const types = await mapWithConcurrency(
		Array.from({ length: 18 }, (_, index) => index + 1),
		(id) => load(`type-${id}`, `${API}/type/${id}`, projectType)
	);
	const typeNames = types.map((type) => type.name);
	const chart = buildDefenceChart(types);

	console.log(`Fetching ${SPECIES_COUNT} species...`);
	const speciesList = await mapWithConcurrency(
		Array.from({ length: SPECIES_COUNT }, (_, index) => index + 1),
		(id) => load(`species-${id}`, `${API}/pokemon-species/${id}`, projectSpecies)
	);

	const chainIds = [
		...new Set(
			speciesList
				.map((species) => species.evolutionChainId)
				.filter((id) => id !== null)
		),
	];

	console.log(`Fetching ${chainIds.length} evolution chains...`);
	const chains = await mapWithConcurrency(chainIds, (id) =>
		load(`chain-${id}`, `${API}/evolution-chain/${id}`, projectEvolutionChain)
	);
	const chainsById = new Map(chains.map((chain) => [chain.id, chain]));

	const varieties = speciesList.flatMap((species) =>
		species.varieties.map((variety) => ({ species, variety }))
	);

	console.log(`Fetching ${varieties.length} Pokémon...`);
	const pokemonList = await mapWithConcurrency(varieties, ({ variety }) =>
		load(`pokemon-${variety.id}`, `${API}/pokemon/${variety.id}`, projectPokemon)
	);

	const speciesBySlug = new Map(
		speciesList.map((species) => [species.slug, species])
	);
	const defaultPokemonBySpecies = new Map();

	varieties.forEach(({ species, variety }, index) => {
		if (variety.isDefault) {
			defaultPokemonBySpecies.set(species.slug, pokemonList[index]);
		}
	});

	console.log("Building records...");
	await mkdir(OUT_DIR, { recursive: true });

	const records = [];

	for (const [position, { species, variety }] of varieties.entries()) {
		const pokemon = pokemonList[position];

		if (!pokemon) {
			console.warn(`  skipping ${variety.slug}: no /pokemon entry`);
			continue;
		}

		const name = displayName(
			species.name,
			species.slug,
			variety.slug,
			variety.isDefault
		);
		const baseStats = pokemon.stats;
		const baseTotal = Object.values(baseStats).reduce(
			(total, value) => total + value,
			0
		);

		const chain = chainsById.get(species.evolutionChainId);
		// The full line, this species included, so the detail page can show where
		// the current Pokémon sits in it.
		const evolutions = (chain?.slugs ?? [])
			.map((slug) => {
				const evolutionSpecies = speciesBySlug.get(slug);
				const evolutionPokemon = defaultPokemonBySpecies.get(slug);

				if (!evolutionSpecies || !evolutionPokemon) return null;

				return {
					slug: evolutionPokemon.slug,
					name: evolutionSpecies.name,
					dexNumber: evolutionSpecies.id,
					spriteSmall: evolutionPokemon.spriteSmall,
				};
			})
			.filter(Boolean);

		const detail = {
			slug: variety.slug,
			dexNumber: species.id,
			name,
			speciesSlug: species.slug,
			generation: species.generation,
			isDefault: variety.isDefault,
			isLegendary: species.isLegendary,
			isMythical: species.isMythical,
			types: pokemon.types,
			spriteSmall: pokemon.spriteSmall,
			spriteBig: pokemon.spriteBig,
			height: pokemon.height,
			weight: pokemon.weight,
			...genderPercents(species.genderRate),
			captureRate: species.captureRate,
			baseTotal,
			baseStats,
			maxStats: Object.fromEntries(
				Object.entries(baseStats).map(([key, value]) => [
					key,
					maxStat(value, key === "hp", variety.slug),
				])
			),
			...matchups(chart, typeNames, pokemon.types),
			abilities: pokemon.abilities,
			evolutions,
			forms: species.varieties.map((other) => ({
				slug: other.slug,
				name: displayName(
					species.name,
					species.slug,
					other.slug,
					other.isDefault
				),
				isDefault: other.isDefault,
			})),
		};

		records.push(detail);
	}

	records.sort(
		(a, b) => a.dexNumber - b.dexNumber || a.slug.localeCompare(b.slug)
	);

	const byGeneration = new Map();

	for (const record of records) {
		if (!byGeneration.has(record.generation)) {
			byGeneration.set(record.generation, []);
		}

		byGeneration.get(record.generation).push(record);
	}

	for (const [generation, entries] of [...byGeneration].sort(
		(a, b) => a[0] - b[0]
	)) {
		const file = path.join(OUT_DIR, `gen-${generation}.json`);

		await writeFile(file, `${JSON.stringify(entries, null, "\t")}\n`);
		console.log(`  data/gen-${generation}.json (${entries.length} entries)`);
	}

	console.log(`Done: ${records.length} entries across ${byGeneration.size} files`);
}

await main();
