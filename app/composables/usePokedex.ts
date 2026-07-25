/**
 * Loads the light index that backs the list page and its filters.
 *
 * The fetch is client-side only: pulling it during prerender would inline the
 * whole dex into the payload of every statically generated route.
 */
export function usePokedex() {
	const entries = useState<PokedexEntry[] | null>("pokedex", () => null);
	const error = useState<string>("pokedex-error", () => "");
	const pending = useState<boolean>("pokedex-pending", () => false);

	async function load() {
		if (entries.value || pending.value) return;

		pending.value = true;

		try {
			entries.value = await $fetch<PokedexEntry[]>("/pokedex/index.json");
			error.value = "";
		} catch (e) {
			error.value = (e as Error).message;
		} finally {
			pending.value = false;
		}
	}

	return { entries, error, pending, load };
}
