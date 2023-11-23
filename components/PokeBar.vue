<template>
	<div class="bg-base-300 p-8 rounded-2xl btn flex flex-nowrap place-items-center justify-center align-middle">
		<img :src="spriteSmall" />
		<div class="font-bold text-white">{{ name }}
		</div>
		<div class="flex flex-col gap-2">
			<div v-for="type in types" class="px-2" v-bind:class="type">{{ type }}</div>
		</div>
	</div>
</template>

<script>
export default {

	props: {
		types: {
			type: Array,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		spriteSmall: {
			type: String,
			required: true,
		},
	},
};
</script>
