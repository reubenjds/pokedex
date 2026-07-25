/**
 * Flags that the router has moved between routes at least once, so page enter
 * animations only run on real navigations and never over the prerendered HTML
 * the browser has already painted.
 */
export default defineNuxtPlugin(() => {
	const navigated = useState("page-navigated", () => false);

	useRouter().afterEach((_to, from) => {
		// `from.name` is undefined for the initial resolution on hydration.
		if (from.name != null) navigated.value = true;
	});
});
