<!-- @format -->

<template>
	<div class="btn btn-block btn-circle flex">
		<img
			src="https://img.pokemondb.net/sprites/sword-shield/icon/ivysaur.png" />
		<div class="font-bold text-white">{{ pokemon }}</div>
		<div class="flex flex-col gap-2">
			<div class="grass px-2">GRASS</div>
			<div class="poison px-2">POISON</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ["pokemon"],
	};
</script>
