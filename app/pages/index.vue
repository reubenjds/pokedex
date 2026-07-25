<script setup lang="ts">
const router = useRouter();
const { entries, load } = usePokedex();

const search = ref("");

const total = computed(() => entries.value?.length ?? 0);

/** Real counts, so the index reads as a table of contents rather than decoration. */
const byGeneration = computed(() =>
	GENERATIONS.map((generation) => ({
		...generation,
		count:
			entries.value?.filter(
				(entry) => entry.generation === generation.value && entry.isDefault
			).length ?? 0,
	}))
);

const matches = computed(() => {
	const query = search.value.trim().toLowerCase();

	if (!query || !entries.value) return [];

	return entries.value
		.filter((entry) => entry.name.toLowerCase().includes(query))
		.sort((a, b) => {
			const byPrefix =
				Number(!a.name.toLowerCase().startsWith(query)) -
				Number(!b.name.toLowerCase().startsWith(query));

			return byPrefix || a.dexNumber - b.dexNumber;
		})
		.slice(0, 5);
});

function submit() {
	const query = search.value.trim();

	router.push(query ? { path: "/pokemon", query: { q: query } } : "/pokemon");
}

// Warming the index here means the dex is already in memory on arrival.
onMounted(() => load());

useHead({ title: "Pokédex" });
</script>

<template>
	<div class="mx-auto max-w-4xl px-6 pb-32">
		<header class="pt-24 pb-16 sm:pt-32">
			<h1
				class="text-highlighted max-w-xl text-4xl leading-[1.05] font-medium tracking-tight text-balance sm:text-5xl">
				Every Pokémon from all nine generations.
			</h1>

			<p class="text-muted mt-5 max-w-[52ch] leading-relaxed">
				Base stats, type matchups, abilities and evolution families for
				<span class="text-toned font-mono tabular-nums">
					{{ total ? total.toLocaleString() : "—" }}
				</span>
				entries, including megas, regional variants and Gigantamax forms.
			</p>

			<form class="mt-10 max-w-md" @submit.prevent="submit()">
				<UInput
					v-model="search"
					class="w-full"
					size="lg"
					variant="subtle"
					icon="i-lucide-search"
					placeholder="Search by name"
					aria-label="Search Pokémon by name" />

				<ul v-if="matches.length" class="divide-default mt-2 divide-y">
					<li v-for="entry in matches" :key="entry.slug">
						<NuxtLink
							:to="`/pokemon/${entry.slug}`"
							class="hover:bg-elevated -mx-2 flex items-center gap-3 rounded-md px-2 py-2 transition-colors">
							<img
								class="size-7 shrink-0 object-contain"
								:alt="entry.name"
								:src="entry.spriteSmall ?? SPRITE_FALLBACK" />
							<span class="text-toned flex-1 truncate text-sm">{{ entry.name }}</span>
							<span class="text-dimmed font-mono text-xs tabular-nums">
								{{ String(entry.dexNumber).padStart(4, "0") }}
							</span>
						</NuxtLink>
					</li>
				</ul>
			</form>
		</header>

		<section class="border-default border-t pt-8">
			<div class="flex items-baseline justify-between">
				<h2 class="text-muted text-sm font-medium">Types</h2>
				<span class="text-dimmed font-mono text-xs tabular-nums">18</span>
			</div>

			<div class="mt-5 flex flex-wrap gap-1.5">
				<NuxtLink
					v-for="type in POKEMON_TYPES"
					:key="type"
					:to="`/pokemon?types=${type}`"
					class="rounded-md transition-opacity hover:opacity-80 active:scale-[0.97]">
					<TypeBadge :type="type" size="md" />
				</NuxtLink>
			</div>
		</section>

		<section class="border-default mt-16 border-t pt-8">
			<div class="flex items-baseline justify-between">
				<h2 class="text-muted text-sm font-medium">Generations</h2>
				<span class="text-dimmed font-mono text-xs tabular-nums">9</span>
			</div>

			<ul class="divide-default mt-3 divide-y">
				<li v-for="generation in byGeneration" :key="generation.value">
					<NuxtLink
						:to="`/pokemon?gens=${generation.value}`"
						class="hover:bg-elevated group -mx-3 flex items-center gap-4 rounded-md px-3 py-3.5 transition-colors">
						<span class="text-dimmed w-8 font-mono text-xs">{{ generation.label }}</span>
						<span class="text-toned flex-1 text-sm">{{ generation.region }}</span>
						<span class="text-dimmed font-mono text-xs tabular-nums">
							{{ generation.count || "—" }}
						</span>
						<UIcon
							name="i-lucide-arrow-right"
							class="text-dimmed size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
					</NuxtLink>
				</li>
			</ul>
		</section>

		<section class="border-default mt-16 border-t pt-8">
			<div class="flex flex-wrap gap-x-10 gap-y-4">
				<NuxtLink
					v-for="shortcut in [
						{ label: 'Browse everything', to: '/pokemon' },
						{ label: 'Legendaries', to: '/pokemon?legendary=1' },
						{ label: 'Mythicals', to: '/pokemon?mythical=1' },
						{ label: 'Alternate forms', to: '/pokemon?forms=1' },
					]"
					:key="shortcut.to"
					:to="shortcut.to"
					class="text-muted hover:text-highlighted text-sm underline-offset-4 transition-colors hover:underline">
					{{ shortcut.label }}
				</NuxtLink>
			</div>
		</section>
	</div>
</template>
