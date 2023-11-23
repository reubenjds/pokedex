<script lang="ts">

import axios from "axios";

const pokemon = ref(null);
const error = ref('');

async function getPokemon() {
	try {
		const response = await axios.get(`http://localhost:4040/pokemon/`);
		pokemon.value = response.data;
	} catch (e) {
		error.value = (e as any).message;

	}
}

onMounted(() => getPokemon);

</script>

<template>
	<div>
		{{ pokemon.value }}
	</div>
	<div class="flex flex-wrap items-center justify-center h-screen">
		<div class="flex flex-col items-center justify-center w-1/3">
			<PokeBar pokemon="Bulbasaur"></PokeBar>
		</div>
	</div>
</template>
