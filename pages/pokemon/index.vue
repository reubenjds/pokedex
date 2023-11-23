<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";

const dex = ref<Pokemon[]>();
const error = ref("");

async function getPokemon() {
	try {
		const response = await axios.get(`http://localhost:4040/pokemon/`);
		dex.value = response.data;
	} catch (e) {
		error.value = (e as any).message;
	}
}

onMounted(() => getPokemon());
</script>

<template>
	<!-- <div>{{ dex }}</div> -->
	<div class="place-items-center grid mt-32 gap-16">
		<input type="text" placeholder="Type here" class="input input-bordered w-96 max-w-xs" />
		<div class="flex flex-wrap items-center justify-center flex-col w-64 gap-3">

			<PokeBar v-for="p in dex" :key="p.name" :name="p.name" :spriteSmall="p.spriteSmallLink" :types="p.types"
				:pokedexNumber="p.pokedexNumber">
			</PokeBar>

		</div>
	</div>
</template>