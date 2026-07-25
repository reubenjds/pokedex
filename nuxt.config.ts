// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2026-07-24",
	devtools: { enabled: true },
	modules: ["@nuxt/ui", "motion-v/nuxt"],
	css: ["~/app.css"],
	// Oswald stands in for the condensed gothic printed on the real type badges.
	fonts: { families: [{ name: "Oswald", provider: "google", weights: [600] }] },
	// The dex is designed dark-only, so skip the light theme and the FOUC script.
	colorMode: { preference: "dark", fallback: "dark" },
});