<script lang="ts">
	import axios from "axios";
	import { Ref, onMounted, ref } from "vue";
	import { Pokemon } from "../../types";

	const dex: Ref<Pokemon | null> = ref(null);
	const error = ref("");

	async function getPokemon() {
		try {
			const response = await axios.get(`http://localhost:4040/pokemon/`);
			dex.value = response.data;
		} catch (e) {
			error.value = (e as any).message;
		}
	}

	onMounted(() => getPokemon);
</script>

<template>
	<div>{{ 1 }}</div>
	<div class="flex flex-wrap items-center justify-center h-screen">
		<div class="flex flex-col items-center justify-center w-1/3">
			<PokeBar pokemon="Bulbasaur"></PokeBar>
		</div>
	</div>
</template>
