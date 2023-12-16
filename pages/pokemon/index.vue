<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const dex = ref<Pokemon[]>();
const error = ref("");

const pageNumber = ref(0);
const name = ref("");

watch(pageNumber, () => {
	getPokemon();
})

watch(name, (newName) => {
	pageNumber.value = 0;
	if (newName.trim()) searchPokemon();
	else getPokemon();
})

async function getPokemon() {
	try {
		const response = await axios.get(`http://localhost:4040/pokemon?page=${pageNumber.value}`);
		dex.value = response.data;
	} catch (e) {
		error.value = (e as any).message;
	}
}

async function searchPokemon() {
	try {
		const response = await axios.get(`http://localhost:4040/pokemon/search?name=${name.value}`);
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

		<input type="text" placeholder="Search..." class="input input-bordered w-96 max-w-xs" v-model="name" />

		<div class="flex flex-wrap items-center justify-center flex-col w-64 gap-3">

			<PokeBar v-for="p in dex" :key="p.name" :name="p.name" :spriteSmall="p.spriteSmallLink" :types="p.types"
				:pokedexNumber="p.pokedexNumber">
			</PokeBar>
			<div class="flex gap-2 items-center justify-center place-items-center">
				<div :class="pageNumber === 0 || name.trim() ? 'btn btn-info btn-circle btn-disabled' : 'btn btn-info btn-circle'"
					:onClick="() => pageNumber -= 1">
					◀
				</div>
				<div> {{ pageNumber + 1 }}</div>
				<div :class="pageNumber === 15 || name.trim() ? 'btn btn-info btn-circle btn-disabled' : 'btn btn-info btn-circle'"
					:onClick="() => pageNumber += 1">▶
				</div>
			</div>
		</div>
	</div>
	<div v-else class="flex items-center justify-center h-screen w-screen">
		<div class="loading loading-dots loading-md "></div>
	</div>
</template>