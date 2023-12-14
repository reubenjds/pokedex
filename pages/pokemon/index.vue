<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const dex = ref<Pokemon[]>();
const error = ref("");

const pageNumber = ref(0);

watch(pageNumber, () => {
	getPokemon();
})

async function getPokemon() {
	try {
		const response = await axios.get(`http://localhost:4040/pokemon?page=${pageNumber.value}`);
		dex.value = response.data;
	} catch (e) {
		error.value = (e as any).message;
	}
}

onMounted(() => getPokemon());
</script>

<template>
	<div v-if="error">{{ error }}</div>

	<div v-else-if="dex" class="place-items-center grid mt-32 gap-16">

		<input type="text" placeholder="Type here" class="input input-bordered w-96 max-w-xs" />

		<div class="flex flex-wrap items-center justify-center flex-col w-64 gap-3">
			<div class="grid grid-flow-col gap-2 justify-center items-center">
				<div class="flex justify-center items-center btn btn-info" :onClick="() => pageNumber -= 1">⟵</div>
				<div class="flex justify-center items-center btn btn-info" :onClick="() => pageNumber += 1">⟶</div>
			</div>
			<PokeBar v-for="p in dex" :key="p.name" :name="p.name" :spriteSmall="p.spriteSmallLink" :types="p.types"
				:pokedexNumber="p.pokedexNumber">
			</PokeBar>

		</div>
	</div>
	<div v-else class="flex items-center justify-center h-screen w-screen">
		<div class="loading loading-dots loading-md "></div>
	</div>
</template>