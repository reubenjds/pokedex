<script setup lang="ts">
// The index now lives at `/`. This page exists only to redirect legacy deep
// links there, preserving the query string so filters like
// `?types=fire&gens=1&sort=total&page=3` keep working.
//
// The site is deployed as a static `nuxt generate` build, so a server redirect
// never runs, and a prerendered meta-refresh stub would drop the query string
// entirely. The redirect therefore happens on the client, where the full query
// is available from the live URL.
const route = useRoute();

useHead({ title: "Redirecting to the Pokédex" });

onMounted(() => {
	navigateTo({ path: "/", query: route.query }, { replace: true });
});
</script>

<template>
	<div class="mx-auto max-w-4xl px-6 py-24">
		<p class="text-muted text-sm">
			Redirecting to the
			<NuxtLink to="/" class="text-highlighted underline underline-offset-4">Pokédex</NuxtLink>.
		</p>
	</div>
</template>
