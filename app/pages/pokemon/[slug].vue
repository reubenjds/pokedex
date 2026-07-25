<script setup lang="ts">
const route = useRoute();
const { load } = usePokemon();

const pokemon = ref<Pokemon | null>();
const error = ref("");

// Rapid navigation between forms can resolve out of order; only the newest
// request is allowed to write to the page.
let requestId = 0;

const statKeys = Object.keys(STAT_LABELS) as StatKey[];

const otherForms = computed(
	() => pokemon.value?.forms.filter((form) => form.slug !== pokemon.value?.slug) ?? []
);

async function getPokemon(slug: string) {
	const id = ++requestId;

	pokemon.value = undefined;
	error.value = "";

	try {
		const result = await load(slug);

		if (id !== requestId) return;
		pokemon.value = result;
	} catch (e) {
		if (id !== requestId) return;
		error.value = (e as Error).message;
	}
}

watch(
	() => route.params.slug,
	(slug) => getPokemon(String(slug))
);

onMounted(() => getPokemon(String(route.params.slug)));

useHead({ title: () => (pokemon.value ? `${pokemon.value.name} — Pokédex` : "Pokédex") });
</script>

<template>
	<div class="mx-auto max-w-4xl px-6 pb-32">
		<header class="pt-16 pb-10">
			<NuxtLink
				to="/"
				class="text-muted hover:text-highlighted inline-flex items-center gap-1.5 text-sm underline-offset-4 transition-colors hover:underline">
				<UIcon name="i-lucide-arrow-left" class="size-4 shrink-0" />
				Back
			</NuxtLink>
		</header>

		<UAlert
			v-if="error"
			icon="i-lucide-triangle-alert"
			color="error"
			variant="subtle"
			title="Something went wrong"
			:description="error" />

		<div v-else-if="pokemon === null" class="py-16">
			<h1 class="text-highlighted text-2xl font-medium tracking-tight">No such Pokémon</h1>
			<p class="text-muted mt-2 max-w-[46ch] text-sm leading-relaxed">
				Nothing in the dex matches
				<span class="text-toned font-mono">{{ route.params.slug }}</span
				>. Forms use their full slug, so Charizard's Mega X is
				<span class="text-toned font-mono">charizard-mega-x</span>.
			</p>
			<NuxtLink
				to="/pokemon"
				class="text-muted hover:text-highlighted mt-5 inline-block text-sm underline underline-offset-4 transition-colors">
				Back to the index
			</NuxtLink>
		</div>

		<div v-else-if="pokemon === undefined" class="space-y-10">
			<div class="flex items-center gap-8">
				<USkeleton class="size-40 shrink-0 rounded-lg" />
				<div class="flex-1 space-y-3">
					<USkeleton class="h-4 w-24" />
					<USkeleton class="h-9 w-56" />
					<USkeleton class="h-5 w-32" />
				</div>
			</div>
			<USkeleton class="h-52 w-full rounded-lg" />
		</div>

		<article v-else>
			<div class="flex flex-col gap-8 sm:flex-row sm:items-center">
				<img
					class="size-40 shrink-0 object-contain sm:size-48"
					:alt="pokemon.name"
					:src="pokemon.spriteBig ?? pokemon.spriteSmall ?? SPRITE_FALLBACK" />

				<div class="min-w-0">
					<p class="text-dimmed text-xs">
						<span class="font-mono">{{ String(pokemon.dexNumber).padStart(4, "0") }}</span>
						· {{ GENERATIONS[pokemon.generation - 1]?.region }}
					</p>

					<h1
						class="text-highlighted mt-3 text-3xl font-medium tracking-tight sm:text-4xl">
						{{ pokemon.name }}
					</h1>

					<div class="mt-4 flex flex-wrap items-center gap-1.5">
						<TypeBadge v-for="type in pokemon.types" :key="type" :type="type" size="md" />

						<span
							v-if="pokemon.isMythical || pokemon.isLegendary"
							class="text-dimmed ms-1 text-xs">
							{{ pokemon.isMythical ? "Mythical" : "Legendary" }}
						</span>
					</div>
				</div>
			</div>

			<dl class="divide-default border-default mt-12 grid grid-cols-2 divide-x border-y sm:grid-cols-4">
				<div
					v-for="fact in [
						{ label: 'Height', value: `${pokemon.height} m` },
						{ label: 'Weight', value: `${pokemon.weight} kg` },
						{ label: 'Capture rate', value: String(pokemon.captureRate) },
						{ label: 'Base total', value: String(pokemon.baseTotal) },
					]"
					:key="fact.label"
					class="px-4 py-4 first:ps-0 last:pe-0">
					<dt class="text-dimmed text-xs">
						{{ fact.label }}
					</dt>
					<dd class="text-highlighted mt-1.5 font-mono text-sm tabular-nums">
						{{ fact.value }}
					</dd>
				</div>
			</dl>

			<section class="mt-16">
				<h2 class="text-dimmed text-xs font-medium">Base stats</h2>

				<div class="mt-4 space-y-2.5">
					<div
						v-for="key in statKeys"
						:key="key"
						class="grid grid-cols-[72px_1fr_92px] items-center gap-4">
						<span class="text-muted text-xs">{{ STAT_LABELS[key] }}</span>

						<div class="bg-elevated relative h-1.5 overflow-hidden rounded-full">
							<div
								class="absolute inset-y-0 left-0 rounded-full"
								:style="{
									width: `${(pokemon.baseStats[key] / MAX_BASE_STAT) * 100}%`,
									backgroundColor: STAT_COLORS[key],
								}"></div>
						</div>

						<span class="text-dimmed text-right font-mono text-xs tabular-nums">
							<span class="text-highlighted">{{ pokemon.baseStats[key] }}</span>
							/ {{ pokemon.maxStats[key] }}
						</span>
					</div>
				</div>

				<p class="text-dimmed mt-5 max-w-[62ch] text-xs leading-relaxed">
					The second figure is the highest value reachable at level 100 with 31 IVs, 252 EVs
					and a beneficial nature.
				</p>
			</section>

			<div class="mt-10 grid gap-12 sm:grid-cols-2">
				<section>
					<h2 class="text-dimmed text-xs font-medium">
						Takes less damage from
					</h2>
					<div v-if="pokemon.strongAgainst.length" class="mt-3 flex flex-wrap gap-1.5">
						<TypeBadge v-for="type in pokemon.strongAgainst" :key="type" :type="type" />
					</div>
					<p v-else class="text-highlighted mt-3 text-sm">Nothing</p>
				</section>

				<section>
					<h2 class="text-dimmed text-xs font-medium">
						Takes more damage from
					</h2>
					<div v-if="pokemon.weakAgainst.length" class="mt-3 flex flex-wrap gap-1.5">
						<TypeBadge v-for="type in pokemon.weakAgainst" :key="type" :type="type" />
					</div>
					<p v-else class="text-highlighted mt-3 text-sm">Nothing</p>
				</section>
			</div>

			<div class="mt-16 grid gap-12 sm:grid-cols-2">
				<section>
					<h2 class="text-dimmed text-xs font-medium">Abilities</h2>
					<ul class="divide-default mt-3 divide-y">
						<li
							v-for="ability in pokemon.abilities"
							:key="ability.name"
							class="flex items-baseline justify-between gap-3 py-2">
							<span class="text-highlighted text-sm">{{ ability.name }}</span>
							<span v-if="ability.isHidden" class="text-dimmed shrink-0 text-xs">
								hidden
							</span>
						</li>
					</ul>
				</section>

				<section>
					<h2 class="text-dimmed text-xs font-medium">Gender ratio</h2>

					<p
						v-if="pokemon.malePercent + pokemon.femalePercent === 0"
						class="text-highlighted mt-3 text-sm">
						Genderless
					</p>

					<template v-else>
						<div class="bg-elevated mt-4 flex h-1.5 overflow-hidden rounded-full">
							<div class="bg-inverted" :style="{ width: `${pokemon.malePercent}%` }"></div>
							<div
								class="bg-[var(--ui-color-neutral-500)]"
								:style="{ width: `${pokemon.femalePercent}%` }"></div>
						</div>
						<div class="text-dimmed mt-2.5 flex justify-between font-mono text-xs tabular-nums">
							<span>{{ pokemon.malePercent }}% male</span>
							<span>{{ pokemon.femalePercent }}% female</span>
						</div>
					</template>
				</section>
			</div>

			<section v-if="otherForms.length" class="mt-16">
				<h2 class="text-dimmed text-xs font-medium">Other forms</h2>

				<ul class="mt-4 grid grid-cols-3 gap-1 sm:grid-cols-4">
					<li v-for="form in otherForms" :key="form.slug">
						<NuxtLink
							:to="`/pokemon/${form.slug}`"
							class="hover:bg-elevated flex flex-col items-center gap-1 rounded-lg px-2 py-3 transition-colors active:scale-[0.98]">
							<img
								class="size-14 object-contain"
								loading="lazy"
								:alt="form.name"
								:src="form.spriteSmall ?? SPRITE_FALLBACK" />
							<span class="text-muted truncate text-xs">{{ form.name }}</span>
						</NuxtLink>
					</li>
				</ul>
			</section>

			<section v-if="pokemon.evolutions.length > 1" class="mt-10">
				<h2 class="text-dimmed text-xs font-medium">
					Evolution family
				</h2>

				<ul class="mt-4 grid grid-cols-3 gap-1 sm:grid-cols-4">
					<li v-for="evolution in pokemon.evolutions" :key="evolution.slug">
						<NuxtLink
							:to="`/pokemon/${evolution.slug}`"
							class="hover:bg-elevated flex flex-col items-center gap-1 rounded-lg px-2 py-3 transition-colors active:scale-[0.98]"
							:class="evolution.slug === pokemon.speciesSlug && 'bg-elevated'">
							<img
								class="size-14 object-contain"
								loading="lazy"
								:alt="evolution.name"
								:src="evolution.spriteSmall ?? SPRITE_FALLBACK" />
							<span class="text-muted truncate text-xs">{{ evolution.name }}</span>
						</NuxtLink>
					</li>
				</ul>
			</section>
		</article>
	</div>
</template>
