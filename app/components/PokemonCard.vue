<script setup lang="ts">
defineProps<{ entry: PokedexEntry }>();
</script>

<template>
	<NuxtLink
		:to="`/pokemon/${entry.slug}`"
		class="hover:bg-elevated group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors active:scale-[0.99]">
		<img
			class="size-10 shrink-0 object-contain"
			loading="lazy"
			decoding="async"
			:alt="entry.name"
			:src="entry.spriteSmall ?? SPRITE_FALLBACK" />

		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-1.5">
				<span class="text-highlighted truncate text-sm font-medium">{{ entry.name }}</span>

				<UIcon
					v-if="entry.isMythical"
					name="i-lucide-sparkles"
					class="text-dimmed size-3 shrink-0"
					title="Mythical" />
				<UIcon
					v-else-if="entry.isLegendary"
					name="i-lucide-crown"
					class="text-dimmed size-3 shrink-0"
					title="Legendary" />
			</div>

			<div class="mt-1 flex gap-1">
				<TypeBadge v-for="type in entry.types" :key="type" :type="type" />
			</div>
		</div>

		<span class="text-dimmed shrink-0 font-mono text-xs tabular-nums">
			{{ String(entry.dexNumber).padStart(4, "0") }}
		</span>
	</NuxtLink>
</template>
