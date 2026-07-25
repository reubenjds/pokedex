/**
 * Copies every sprite the dex references out of the PokeAPI sprite repository
 * and into `public/sprites`, so the deployed site never points a visitor at
 * someone else's origin.
 *
 * Downloads land in `.cache/sprites` first. That directory is gitignored and
 * keyed by the upstream path, so a rebuild only fetches sprites it has not seen
 * before -- the full set is ~180 MB and re-fetching it on every `nuxt dev` would
 * be unusable.
 */

import { createHash } from "node:crypto";
import { copyFile, mkdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const REMOTE_PREFIX =
	"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

/** Concurrent fetches. GitHub serves these from a CDN and tolerates this fine. */
const CONCURRENCY = 24;
const ATTEMPTS = 3;

/**
 * Maps an upstream sprite URL to its path under `public/sprites`, mirroring the
 * upstream layout minus the `other/` segment: `other/official-artwork/1.png`
 * becomes `official-artwork/1.png`.
 *
 * Returns null for anything outside the sprite repository so unexpected hosts
 * surface as an error rather than being silently rewritten.
 */
export function localSpritePath(url) {
	if (typeof url !== "string" || !url.startsWith(REMOTE_PREFIX)) return null;

	const tail = url.slice(REMOTE_PREFIX.length).replace(/^other\//, "");

	// Refuse anything that could escape the output directory.
	if (!/^[a-z0-9/-]+\.png$/i.test(tail) || tail.includes("..")) return null;

	return tail;
}

async function exists(file) {
	try {
		const info = await stat(file);
		return info.size > 0;
	} catch {
		return false;
	}
}

async function download(url, attempt = 1) {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		return Buffer.from(await response.arrayBuffer());
	} catch (error) {
		if (attempt >= ATTEMPTS) {
			throw new Error(`Could not fetch ${url}: ${error.message}`);
		}

		await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));

		return download(url, attempt + 1);
	}
}

/**
 * Fetches every URL into the cache, then copies it into the output directory.
 * Returns the number that had to be fetched.
 */
export async function vendorSprites(urls, { cacheDir, outDir }) {
	const jobs = [];

	for (const url of new Set(urls)) {
		const tail = localSpritePath(url);

		if (!tail) throw new Error(`Unexpected sprite URL in source data: ${url}`);

		jobs.push({
			url,
			// The upstream path is not filesystem-safe, and two sprites in
			// different directories can share a basename.
			cached: path.join(cacheDir, createHash("sha256").update(url).digest("hex")),
			out: path.join(outDir, tail),
		});
	}

	await mkdir(cacheDir, { recursive: true });

	let downloaded = 0;
	let cursor = 0;

	async function worker() {
		while (cursor < jobs.length) {
			const job = jobs[cursor++];

			if (!(await exists(job.cached))) {
				const body = await download(job.url);

				// Rename in from a temporary file so an interrupted run cannot leave
				// a truncated sprite behind that later runs would treat as cached.
				const temporary = `${job.cached}.${process.pid}.tmp`;

				await writeFile(temporary, body);
				await rename(temporary, job.cached);

				downloaded++;
			}

			await mkdir(path.dirname(job.out), { recursive: true });
			await copyFile(job.cached, job.out);
		}
	}

	await Promise.all(
		Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, worker)
	);

	return { total: jobs.length, downloaded };
}

/** Rewrites a record's sprite URLs in place to their vendored paths. */
export function rewriteRecordSprites(record, base = "/sprites") {
	const rewrite = (url) => {
		if (url == null) return null;

		const tail = localSpritePath(url);

		if (!tail) throw new Error(`Unexpected sprite URL in source data: ${url}`);

		return `${base}/${tail}`;
	};

	record.spriteSmall = rewrite(record.spriteSmall);
	record.spriteBig = rewrite(record.spriteBig);

	for (const evolution of record.evolutions ?? []) {
		evolution.spriteSmall = rewrite(evolution.spriteSmall);
	}

	for (const form of record.forms ?? []) {
		form.spriteSmall = rewrite(form.spriteSmall);
	}

	return record;
}

/** Every sprite URL a record references, skipping the nulls. */
export function collectSpriteUrls(record) {
	const urls = [record.spriteSmall, record.spriteBig];

	for (const evolution of record.evolutions ?? []) urls.push(evolution.spriteSmall);
	for (const form of record.forms ?? []) urls.push(form.spriteSmall);

	return urls.filter((url) => url != null);
}

export { REMOTE_PREFIX };

/** The sprite the UI falls back to when a form has none of its own. */
export const FALLBACK_URL = `${REMOTE_PREFIX}0.png`;
