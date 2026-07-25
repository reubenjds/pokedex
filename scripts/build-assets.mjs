/**
 * Expands the committed per-generation source data into the static assets the
 * site serves. Runs before `nuxt dev`, `nuxt build` and `nuxt generate`.
 *
 *   data/gen-<n>.json           source of truth, one file per generation
 *     ->  public/pokedex/index.json    light record per entry, drives the list
 *     ->  public/pokedex/<slug>.json   full record per entry, drives the detail page
 *
 * The generated output is minified and gitignored; only data/ is committed.
 */

import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "data");
const OUT_DIR = path.join(ROOT, "public", "pokedex");

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
}

await main();
