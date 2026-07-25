<script setup lang="ts">
const router = useRouter();
const { $takeInitialQuery } = useNuxtApp();
const { entries, error, pending, load } = usePokedex();

const asList = (value: string | null) =>
	String(value ?? "")
		.split(",")
		.map((part) => part.trim())
		.filter(Boolean);

const search = ref("");
const selectedTypes = ref<PokemonType[]>([]);
const selectedGenerations = ref<number[]>([]);
const legendaryOnly = ref(false);
const mythicalOnly = ref(false);
const includeForms = ref(false);
const sort = ref<SortKey>("dex");
const page = ref(1);

// The URL is only trustworthy once the initial query has been restored.
const hydrated = ref(false);

function readQuery() {
	// Consume the captured query unconditionally, otherwise it can leak into a
	// later client-side navigation that legitimately has no query string.
	const initial = $takeInitialQuery();
	const query = new URLSearchParams(window.location.search || initial);
	const sortParam = query.get("sort");

	search.value = query.get("q") ?? "";
	selectedTypes.value = asList(query.get("types")).filter((type): type is PokemonType =>
		POKEMON_TYPES.includes(type as PokemonType)
	);
	selectedGenerations.value = asList(query.get("gens"))
		.map(Number)
		.filter((value) => value >= 1 && value <= 9);
	legendaryOnly.value = query.get("legendary") === "1";
	mythicalOnly.value = query.get("mythical") === "1";
	includeForms.value = query.get("forms") === "1";
	sort.value = isSortKey(sortParam) ? sortParam : "dex";
	page.value = Math.max(1, Number(query.get("page") ?? 1) || 1);
}

/** Whether the visitor has narrowed the dex in any way. */
const hasActiveFilters = computed(
	() =>
		Boolean(search.value.trim()) ||
		selectedTypes.value.length > 0 ||
		selectedGenerations.value.length > 0 ||
		legendaryOnly.value ||
		mythicalOnly.value ||
		includeForms.value ||
		sort.value !== "dex"
);

/** 0 = name starts with the query, 1 = name merely contains it. */
function rank(entry: PokedexEntry, query: string) {
	const name = entry.name.toLowerCase();

	if (name.startsWith(query)) return 0;
	return name.includes(query) || entry.slug.includes(query) ? 1 : -1;
}

const comparators: Record<SortKey, (a: PokedexEntry, b: PokedexEntry) => number> = {
	dex: (a, b) => a.dexNumber - b.dexNumber || a.slug.localeCompare(b.slug),
	name: (a, b) => a.name.localeCompare(b.name),
	total: (a, b) => b.baseTotal - a.baseTotal || a.dexNumber - b.dexNumber,
};

const results = computed(() => {
	if (!entries.value) return [];

	const query = search.value.trim().toLowerCase();
	const ranks = new Map<string, number>();

	const filtered = entries.value.filter((entry) => {
		if (!includeForms.value && !entry.isDefault) return false;
		if (legendaryOnly.value && !entry.isLegendary) return false;
		if (mythicalOnly.value && !entry.isMythical) return false;

		if (
			selectedGenerations.value.length > 0 &&
			!selectedGenerations.value.includes(entry.generation)
		) {
			return false;
		}

		if (
			selectedTypes.value.length > 0 &&
			!selectedTypes.value.every((type) => entry.types.includes(type))
		) {
			return false;
		}

		if (query) {
			const relevance = rank(entry, query);

			if (relevance < 0) return false;
			ranks.set(entry.slug, relevance);
		}

		return true;
	});

	return filtered.sort((a, b) => {
		if (query) {
			const difference = ranks.get(a.slug)! - ranks.get(b.slug)!;

			if (difference !== 0) return difference;
		}

		return comparators[sort.value](a, b);
	});
});

const pageCount = computed(() => Math.max(1, Math.ceil(results.value.length / PAGE_SIZE)));

const visible = computed(() =>
	results.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE)
);

function toggleType(type: PokemonType) {
	selectedTypes.value = selectedTypes.value.includes(type)
		? selectedTypes.value.filter((value) => value !== type)
		: [...selectedTypes.value, type];
}

function toggleGeneration(generation: number) {
	selectedGenerations.value = selectedGenerations.value.includes(generation)
		? selectedGenerations.value.filter((value) => value !== generation)
		: [...selectedGenerations.value, generation];
}

function reset() {
	search.value = "";
	selectedTypes.value = [];
	selectedGenerations.value = [];
	legendaryOnly.value = false;
	mythicalOnly.value = false;
	includeForms.value = false;
	sort.value = "dex";
}

// Any change to the filters invalidates the current page.
watch(
	[search, selectedTypes, selectedGenerations, legendaryOnly, mythicalOnly, includeForms, sort],
	() => {
		if (hydrated.value) page.value = 1;
	}
);

// Only clamp once there is data, or an empty result set would force page 1
// before the dex has even loaded and discard a `?page=N` deep link.
watch([page, pageCount], () => {
	if (!entries.value) return;

	if (page.value > pageCount.value) page.value = pageCount.value;
	else if (page.value < 1 || Number.isNaN(page.value)) page.value = 1;
});

watch(
	[
		search,
		selectedTypes,
		selectedGenerations,
		legendaryOnly,
		mythicalOnly,
		includeForms,
		sort,
		page,
	],
	() => {
		if (!hydrated.value) return;

		router.replace({
			query: {
				...(search.value.trim() ? { q: search.value.trim() } : {}),
				...(selectedTypes.value.length ? { types: selectedTypes.value.join(",") } : {}),
				...(selectedGenerations.value.length
					? { gens: selectedGenerations.value.join(",") }
					: {}),
				...(legendaryOnly.value ? { legendary: "1" } : {}),
				...(mythicalOnly.value ? { mythical: "1" } : {}),
				...(includeForms.value ? { forms: "1" } : {}),
				...(sort.value !== "dex" ? { sort: sort.value } : {}),
				...(page.value > 1 ? { page: String(page.value) } : {}),
			},
		});
	}
);

onMounted(async () => {
	readQuery();
	load();

	// Let the restored state settle before the watchers are allowed to react,
	// otherwise they reset `page` back to 1 on the very first flush.
	await nextTick();
	hydrated.value = true;
});

useHead({ title: "Pokédex — browse all 1,351 Pokémon" });
</script>

<template>
	<div class="mx-auto max-w-4xl px-6 pb-32">
		<header class="flex items-end justify-between pt-16 pb-10">
			<div>
				<h1 class="text-highlighted text-2xl font-medium tracking-tight">All Pokémon</h1>
			</div>

			<NuxtLink
				to="/"
				class="text-muted hover:text-highlighted text-sm underline-offset-4 transition-colors hover:underline">
				Home
			</NuxtLink>
		</header>

		<UAlert
			v-if="error"
			icon="i-lucide-triangle-alert"
			color="error"
			variant="subtle"
			title="Could not load the Pokédex"
			:description="error" />

		<template v-else>
			<!-- Search reads as an input, not a full-width banner. -->
			<div class="max-w-md">
				<UInput
					v-model="search"
					class="w-full"
					size="lg"
					variant="subtle"
					icon="i-lucide-search"
					placeholder="Search by name"
					aria-label="Search Pokémon by name"
					:ui="{ trailing: 'pe-1' }">
					<template v-if="search" #trailing>
						<UButton
							icon="i-lucide-x"
							color="neutral"
							variant="ghost"
							size="xs"
							aria-label="Clear search"
							@click="search = ''" />
					</template>
				</UInput>
			</div>

			<!-- Filters live in the open, directly beneath the search. -->
			<div class="border-default mt-5 border-t pt-5">
				<div class="space-y-5">
					<!-- Not a <fieldset>: a <legend> cannot share a row with the reset control. -->
					<div role="group" aria-labelledby="type-filter-label">
						<div class="flex items-center justify-between gap-4">
							<p id="type-filter-label" class="text-muted text-sm font-medium">Type</p>

							<button
								type="button"
								class="text-dimmed hover:text-highlighted text-xs underline-offset-4 transition-colors hover:underline"
								:class="!hasActiveFilters && 'invisible'"
								:tabindex="hasActiveFilters ? undefined : -1"
								:aria-hidden="!hasActiveFilters"
								@click="reset()">
								Clear all
							</button>
						</div>

						<div class="mt-3 flex flex-wrap gap-1.5">
							<button
								v-for="type in POKEMON_TYPES"
								:key="type"
								type="button"
								class="rounded-md transition-opacity hover:opacity-80 active:scale-[0.97]"
								:aria-pressed="selectedTypes.includes(type)"
								@click="toggleType(type)">
								<TypeBadge :type="type" size="md" :muted="!selectedTypes.includes(type)" />
							</button>
						</div>

						<p v-if="selectedTypes.length > 1" class="text-dimmed mt-3 text-xs">
							Matching Pokémon that are all {{ selectedTypes.length }} selected types.
						</p>
					</div>

					<fieldset>
						<legend class="text-muted text-sm font-medium">Generation</legend>

						<div class="mt-3 flex flex-wrap gap-1.5">
							<button
								v-for="generation in GENERATIONS"
								:key="generation.value"
								type="button"
								class="h-7 rounded-md px-3 font-mono text-xs transition-colors active:scale-[0.97]"
								:class="
									selectedGenerations.includes(generation.value)
										? 'bg-inverted text-inverted'
										: 'bg-elevated text-muted hover:text-highlighted'
								"
								:aria-pressed="selectedGenerations.includes(generation.value)"
								@click="toggleGeneration(generation.value)">
								{{ generation.label }}
							</button>
						</div>
					</fieldset>

					<div class="flex flex-wrap items-end justify-between gap-6">
						<div class="space-y-3">
							<USwitch v-model="legendaryOnly" label="Legendary only" size="sm" />
							<USwitch v-model="mythicalOnly" label="Mythical only" size="sm" />
							<USwitch v-model="includeForms" label="Include alternate forms" size="sm" />
						</div>

						<USelect
							v-model="sort"
							class="w-48"
							size="sm"
							variant="subtle"
							aria-label="Sort order"
							:items="[...SORT_OPTIONS]" />
					</div>
				</div>
			</div>

			<div v-if="pending || !entries" class="mt-10 grid gap-1 sm:grid-cols-2">
				<USkeleton v-for="index in 12" :key="index" class="h-16 rounded-lg" />
			</div>

			<template v-else>
				<div class="border-default mt-10 flex items-baseline justify-between border-t pt-4">
					<p class="text-muted text-sm">
						<span class="tabular-nums">{{ results.length.toLocaleString() }}</span> results
					</p>

					<p v-if="pageCount > 1" class="text-dimmed font-mono text-xs tabular-nums">
						{{ page }} / {{ pageCount }}
					</p>
				</div>

				<div v-if="results.length" class="mt-2 grid gap-1 sm:grid-cols-2">
					<PokemonCard v-for="entry in visible" :key="entry.slug" :entry="entry" />
				</div>

				<div v-else class="py-24">
					<p class="text-highlighted text-sm font-medium">Nothing matches those filters</p>
					<p class="text-muted mt-1.5 max-w-[42ch] text-sm leading-relaxed">
						Narrowing by more than one type only keeps Pokémon that have all of them. Try
						removing one, or widening the search.
					</p>
					<button
						type="button"
						class="text-muted hover:text-highlighted mt-4 text-sm underline underline-offset-4 transition-colors"
						@click="reset()">
						Clear all filters
					</button>
				</div>

				<div v-if="pageCount > 1" class="mt-10 flex justify-center">
					<UPagination
						v-model:page="page"
						color="neutral"
						variant="ghost"
						active-color="neutral"
						active-variant="subtle"
						:total="results.length"
						:items-per-page="PAGE_SIZE"
						:sibling-count="1" />
				</div>
			</template>
		</template>
	</div>
</template>
