<script setup>
import "./app.css";

useHead({
	title: "Pokedex",
	link: [
		{
			rel: "icon",
			type: "image/svg",
			href: "/favicon.svg"
		}
	]
});
</script>

<template>
	<div>
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>
