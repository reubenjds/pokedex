<template>
	<NuxtLink :href="'/pokemon/' + pokedexNumber"
		class="bg-base-300 p-4 rounded-2xl flex flex-row w-full place-items-center">
		<div class="h-[44px] w-[56px] bg-transparent">
			<img class="w-full h-full object-cover" :src="spriteSmall" />
		</div>
		<div class="w-full">
			<div class="font-bold text-white text-center">{{ name }}</div>
			<div class="flex flex-row gap-2 justify-center">

				<div v-for="type in types" class="" :class="type">{{ type }}</div>

			</div>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">

defineProps<{
	types: string[];
	name: string;
	spriteSmall: string;
	pokedexNumber: number;
}>()
</script>
