<script lang="ts" setup>
import axios from "axios";
import { onMounted, ref } from "vue";

function toTitleCase(str: string) {
	return str.replace(
		/\w\S*/g,
		function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}
	);
}

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
	<div class="flex flex-wrap items-center justify-center h-screen">

		<div class="flex flex-col items-center justify-center">
			<PokeBar v-for="p in dex" :key="p.name" :name="toTitleCase(p.name)" :spriteSmall="p.spriteSmallLink"
				:types="p.types">
			</PokeBar>
		</div>
	</div>
</template>