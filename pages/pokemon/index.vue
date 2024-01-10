<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { http } from "~/utils/client";

const dex = ref<Pokemon[]>();
const error = ref("");

const pageNumber = ref(1);
const name = ref("");

let context = 0;

watch(pageNumber, (newPageNumber) => {
	if (newPageNumber > 16) pageNumber.value = 16;
	else if (newPageNumber < 1 && newPageNumber || newPageNumber === 0) pageNumber.value = 1;
	else if (newPageNumber) getPokemon();
})

watch(name, (newName) => {
	pageNumber.value = 1;
	debounceSend();
})

async function getPokemon() {
	try {
		const localContext = ++context;
		const response = await http.get("/pokemon", {
			params: {
				page: pageNumber.value - 1
			}
		});
		if (localContext === context) dex.value = response.data;
	} catch (e) {
		error.value = (e as any).message;
	}
}

let last: NodeJS.Timeout | null = null;

function debounceSend() {
	if (last) clearTimeout(last);

	last = setTimeout(() => {
		if (name.value.trim()) searchPokemon();
		else getPokemon();
	}, 500);
}

async function searchPokemon() {
	try {
		const localContext = ++context;
		const response = await http.get("/pokemon/search", {
			params: {
				name: name.value.trim()
			}
		});
		if (localContext === context) dex.value = response.data;
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
				:pokedexNumber="p.pokedexNumber" class="hover:scale-125 transition-all duration-500 ease-in-out">
			</PokeBar>
			<div class="flex gap-2 items-center justify-center place-items-center pb-5">
				<div :class="pageNumber === 1 || name.trim() ? 'btn btn-info btn-circle btn-disabled' : 'btn btn-info btn-circle'"
					:onClick="() => pageNumber--">
					◀
				</div>

				<input type="number"
					class="input w-full max-w-xs text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					v-model="pageNumber" :placeholder="`${pageNumber}`" :disabled="name.trim() ? true : false" />
				<div :class="pageNumber === 16 || name.trim() ? 'btn btn-info btn-circle btn-disabled' : 'btn btn-info btn-circle'"
					:onClick="() => pageNumber++">▶
				</div>
			</div>
		</div>
	</div>
	<div v-else class="flex items-center justify-center h-screen w-screen">
		<div class="loading loading-dots loading-md "></div>
	</div>
</template>