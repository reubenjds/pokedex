/**
 * Loads a single Pokémon record. Resolves to `null` for an unknown slug, which
 * is what drives the 404 state on the detail page.
 */
export function usePokemon() {
	const cache = useState<Record<string, Pokemon | null>>("pokemon", () => ({}));

	async function load(slug: string) {
		if (slug in cache.value) return cache.value[slug]!;

		try {
			const pokemon = await $fetch<Pokemon>(`/pokedex/${slug}.json`, {
				responseType: "json",
			});

			// A missing file falls through to the SPA fallback, which is HTML.
			cache.value[slug] = typeof pokemon === "object" ? pokemon : null;
		} catch {
			cache.value[slug] = null;
		}

		return cache.value[slug]!;
	}

	return { cache, load };
}
