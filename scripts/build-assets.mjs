/**
 * Expands the committed per-generation source data into the static assets the
 * site serves. Runs before `nuxt dev`, `nuxt build` and `nuxt generate`.
 *
 *   data/gen-<n>.json           source of truth, one file per generation
 *     ->  public/pokedex/index.json    light record per entry, drives the list
 *     ->  public/pokedex/<slug>.json   full record per entry, drives the detail page
 *     ->  public/sprites/...           every sprite, copied off PokeAPI
 *
 * Sprite URLs in data/ point at the upstream repository. They are rewritten to
 * local paths here so nothing the deployed site loads comes from another origin.
 *
 * The generated output is minified and gitignored; only data/ is committed.
 */

import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
	collectSpriteUrls,
	FALLBACK_URL,
	rewriteRecordSprites,
	vendorSprites,
} from "./vendor-sprites.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "data");
const OUT_DIR = path.join(ROOT, "public", "pokedex");
const SPRITE_DIR = path.join(ROOT, "public", "sprites");
const SPRITE_CACHE = path.join(ROOT, ".cache", "sprites");

const INDEX_FIELDS = [
	"slug",
	"dexNumber",
	"name",
	"types",
	"generation",
	"spriteSmall",
	"isDefault",
	"isLegendary",
	"isMythical",
	"baseTotal",
];

async function main() {
	const files = (await readdir(DATA_DIR))
		.filter((file) => /^gen-\d+\.json$/.test(file))
		.sort(
			(a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0])
		);

	if (files.length === 0) {
		throw new Error(
			`No gen-<n>.json files in ${DATA_DIR}. Run \`pnpm build:data\` first.`
		);
	}

	const records = [];

	for (const file of files) {
		const contents = JSON.parse(await readFile(path.join(DATA_DIR, file), "utf8"));

		records.push(...contents);
	}

	await rm(OUT_DIR, { recursive: true, force: true });
	await mkdir(OUT_DIR, { recursive: true });

	// `forms` entries in the source data carry only slug and name, but each form
	// is also a top-level record, so the sprite can be joined in here rather than
	// duplicated into data/.
	const spriteBySlug = new Map(
		records.map((record) => [record.slug, record.spriteSmall])
	);

	for (const record of records) {
		for (const form of record.forms ?? []) {
			form.spriteSmall = spriteBySlug.get(form.slug) ?? null;
		}
	}

	// Vendor before writing any payload, so a failed fetch aborts the build
	// rather than shipping records that point at paths with nothing behind them.
	const spriteUrls = records.flatMap(collectSpriteUrls);

	spriteUrls.push(FALLBACK_URL);

	await rm(SPRITE_DIR, { recursive: true, force: true });
	await mkdir(SPRITE_DIR, { recursive: true });

	const sprites = await vendorSprites(spriteUrls, {
		cacheDir: SPRITE_CACHE,
		outDir: SPRITE_DIR,
	});

	const seen = new Set();
	const index = [];

	for (const record of records) {
		if (!/^[a-z0-9-]+$/.test(record.slug)) {
			throw new Error(`Invalid slug in source data: ${record.slug}`);
		}

		if (record.slug === "index") {
			throw new Error(
				"Invalid slug in source data: index is reserved for the index payload"
			);
		}

		if (seen.has(record.slug)) {
			throw new Error(`Duplicate slug in source data: ${record.slug}`);
		}

		seen.add(record.slug);
		rewriteRecordSprites(record);
		index.push(
			Object.fromEntries(INDEX_FIELDS.map((field) => [field, record[field]]))
		);

		await writeFile(
			path.join(OUT_DIR, `${record.slug}.json`),
			JSON.stringify(record)
		);
	}

	index.sort((a, b) => a.dexNumber - b.dexNumber || a.slug.localeCompare(b.slug));

	await writeFile(path.join(OUT_DIR, "index.json"), JSON.stringify(index));

	console.log(
		`pokedex: ${index.length} entries from ${files.length} source files -> public/pokedex`
	);
	console.log(
		`sprites: ${sprites.total} vendored -> public/sprites (${sprites.downloaded} fetched, ${sprites.total - sprites.downloaded} cached)`
	);
}

await main();
