/**
 * While hydrating a prerendered page, Nuxt momentarily replaces the URL with the
 * path it was prerendered at, which drops the query string before any page's
 * `onMounted` runs. Capture it here — plugins execute before that happens — and
 * hand it out exactly once so later client-side navigations are unaffected.
 */
export default defineNuxtPlugin(() => {
	let initial: string | null = window.location.search;

	return {
		provide: {
			takeInitialQuery() {
				const value = initial;

				initial = null;

				return value ?? "";
			},
		},
	};
});
