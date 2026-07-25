<script setup lang="ts">
import { motion } from "motion-v";

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

const reduceMotion = useReducedMotion();
const pageMotion = usePageMotion();

const typeLabel = computed(() => {
	if (selectedTypes.value.length === 0) return "Type";
	if (selectedTypes.value.length === 1) return titleCase(selectedTypes.value[0]!);

	return `Type · ${selectedTypes.value.length}`;
});

const generationLabel = computed(() => {
	if (selectedGenerations.value.length === 0) return "Generation";

	if (selectedGenerations.value.length === 1) {
		const only = GENERATIONS.find(
			(generation) => generation.value === selectedGenerations.value[0]
		);

		return only ? only.region : "Generation";
	}

	return `Generation · ${selectedGenerations.value.length}`;
});

const toggleCount = computed(
	() =>
		Number(legendaryOnly.value) + Number(mythicalOnly.value) + Number(includeForms.value)
);

/**
 * Re-keys the grid so the stagger replays whenever a different set of results
 * appears. Keying on the slugs rather than a filter signature means paging or
 * re-sorting animates, but typing that does not change the visible page does
 * not restart the animation under the user's cursor.
 */
const resultsKey = computed(() => visible.value.map((entry) => entry.slug).join());

const listVariants = {	hidden: {},
	shown: { transition: { staggerChildren: 0.018 } },
};

const rowVariants = {
	hidden: { opacity: 0, y: 6 },
	shown: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
	},
};

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
	<div
		v-motion
		class="mx-auto max-w-4xl px-6 pb-32"
		:initial="pageMotion.initial.value"
		:animate="pageMotion.animate"
		:transition="pageMotion.transition">
		<header class="pt-16 pb-10">
			<h1 class="text-highlighted text-2xl font-medium tracking-tight">Pokédex</h1>
		</header>

		<UAlert
			v-if="error"
			icon="i-lucide-triangle-alert"
			color="error"
			variant="subtle"
			title="Could not load the Pokédex"
			:description="error" />

		<template v-else>
			<!-- The search is the primary way into the dex, so it reads large. -->
			<div class="max-w-xl">
				<UInput
					v-model="search"
					class="w-full"
					size="xl"
					variant="subtle"
					placeholder="Search by name"
					aria-label="Search Pokémon by name"
					:ui="{
						base: 'h-13 rounded-full ps-5 pe-2 text-base',
						trailing: 'pe-2',
					}">
					<template v-if="search" #trailing>
						<UButton
							icon="i-lucide-x"
							color="neutral"
							variant="ghost"
							size="sm"
							class="rounded-full"
							aria-label="Clear search"
							@click="search = ''" />
					</template>
				</UInput>
			</div>

			<!--
				Filters sit on one row so the results stay close to the search.
				Each control states its own selection, which replaces the old
				always-open panel of chips.
			-->
			<div class="mt-4 flex flex-wrap items-center gap-2">
				<UPopover :content="{ align: 'start' }">
					<UButton
						color="neutral"
						:variant="selectedTypes.length ? 'solid' : 'subtle'"
						trailing-icon="i-lucide-chevron-down">
						{{ typeLabel }}
					</UButton>

					<template #content>
						<div class="w-72 p-3">
							<div class="flex flex-wrap gap-1.5">
								<button
									v-for="type in POKEMON_TYPES"
									:key="type"
									type="button"
									class="rounded-full transition-opacity hover:opacity-80"
									:aria-pressed="selectedTypes.includes(type)"
									@click="toggleType(type)">
									<TypeBadge :type="type" size="md" :muted="!selectedTypes.includes(type)" />
								</button>
							</div>

							<p v-if="selectedTypes.length > 1" class="text-dimmed mt-3 text-xs">
								Only Pokémon with all {{ selectedTypes.length }} types.
							</p>
						</div>
					</template>
				</UPopover>

				<UPopover :content="{ align: 'start' }">
					<UButton
						color="neutral"
						:variant="selectedGenerations.length ? 'solid' : 'subtle'"
						trailing-icon="i-lucide-chevron-down">
						{{ generationLabel }}
					</UButton>

					<template #content>
						<div class="grid w-64 grid-cols-3 gap-1 p-2">
							<button
								v-for="generation in GENERATIONS"
								:key="generation.value"
								type="button"
								class="rounded-md px-2 py-1.5 text-left text-xs transition-colors"
								:class="
									selectedGenerations.includes(generation.value)
										? 'bg-inverted text-inverted'
										: 'text-muted hover:bg-elevated hover:text-highlighted'
								"
								:aria-pressed="selectedGenerations.includes(generation.value)"
								@click="toggleGeneration(generation.value)">
								<span class="font-mono">{{ generation.label }}</span>
								<span class="block truncate">{{ generation.region }}</span>
							</button>
						</div>
					</template>
				</UPopover>

				<UPopover :content="{ align: 'start' }">
					<UButton
						color="neutral"
						:variant="toggleCount ? 'solid' : 'subtle'"
						trailing-icon="i-lucide-chevron-down">
						{{ toggleCount ? `Options · ${toggleCount}` : "Options" }}
					</UButton>

					<template #content>
						<div class="w-64 space-y-3 p-3">
							<USwitch v-model="legendaryOnly" label="Legendary only" size="sm" />
							<USwitch v-model="mythicalOnly" label="Mythical only" size="sm" />
							<USwitch v-model="includeForms" label="Include alternate forms" size="sm" />
						</div>
					</template>
				</UPopover>

				<USelect
					v-model="sort"
					class="w-40"
					color="neutral"
					variant="subtle"
					aria-label="Sort order"
					:items="[...SORT_OPTIONS]" />

				<button
					type="button"
					class="text-dimmed hover:text-highlighted ms-auto text-xs underline-offset-4 transition-colors hover:underline"
					:class="!hasActiveFilters && 'invisible'"
					:tabindex="hasActiveFilters ? undefined : -1"
					:aria-hidden="!hasActiveFilters"
					@click="reset()">
					Clear all
				</button>
			</div>

			<!-- Mirrors the loaded layout exactly so nothing shifts on arrival. -->
			<div v-if="pending || !entries">
				<div class="border-default mt-8 flex items-baseline justify-between border-t pt-4">
					<USkeleton class="h-5 w-24" />
				</div>

				<div class="mt-2 grid gap-1 sm:grid-cols-2">
					<div
						v-for="index in PAGE_SIZE"
						:key="index"
						class="flex items-center gap-3 px-3 py-2.5">
						<USkeleton class="size-10 shrink-0 rounded-md" />

						<div class="min-w-0 flex-1">
							<USkeleton class="h-5 w-28" />
							<USkeleton class="mt-1 h-[19px] w-16 rounded-full" />
						</div>

						<USkeleton class="h-3 w-8 shrink-0" />
					</div>
				</div>
			</div>

			<template v-else>
				<div class="border-default mt-8 flex items-baseline justify-between border-t pt-4">
					<p class="text-muted text-sm">
						<span class="tabular-nums">{{ results.length.toLocaleString() }}</span> results
					</p>

					<p v-if="pageCount > 1" class="text-dimmed font-mono text-xs tabular-nums">
						{{ page }} / {{ pageCount }}
					</p>
				</div>

				<!--
					The component form is required here: variant propagation to
					children (and so the stagger) only works through Motion's
					component tree, not the directive. It is safe on this branch
					because results only exist once the dex has loaded client-side,
					so this never renders during prerendering.
				-->
				<motion.div
					v-if="results.length"
					:key="resultsKey"
					class="mt-2 grid gap-1 sm:grid-cols-2"
					:initial="reduceMotion ? false : 'hidden'"
					animate="shown"
					:variants="listVariants">
					<motion.div v-for="entry in visible" :key="entry.slug" :variants="rowVariants">
						<PokemonCard :entry="entry" />
					</motion.div>
				</motion.div>

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
