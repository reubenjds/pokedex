<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		type: PokemonType;
		size?: "sm" | "md";
		/** Unselected filter state: the chrome stays, the colour drains out. */
		muted?: boolean;
	}>(),
	{ size: "sm", muted: false }
);

const color = computed(() => TYPE_COLORS[props.type]);
</script>

<template>
	<span
		class="pkmn-badge inline-flex shrink-0 items-center justify-center rounded-full font-bold uppercase"
		:class="[
			size === 'sm'
				? 'h-[19px] px-2 text-[10px] tracking-[0.06em]'
				: 'h-[23px] px-2.5 text-[11px] tracking-[0.07em]',
			muted && 'pkmn-badge--muted',
		]"
		:style="{ '--fill': color, color: muted ? undefined : TYPE_INK }">
		{{ type }}
	</span>
</template>

<style scoped>
/*
 * Modelled on the printed type badges: a hard near-black outline, a bright
 * inner keyline, and a highlight that falls away down the pill. The sheen only
 * ever lightens — darkening the lower half would drop the label below AAA.
 */
.pkmn-badge {
	font-family: var(--font-badge);
	background-color: var(--fill);
	background-image: linear-gradient(
		180deg,
		rgb(255 255 255 / 0.24) 0%,
		rgb(255 255 255 / 0.06) 48%,
		rgb(255 255 255 / 0) 52%
	);
	border: 1.5px solid #101012;
	box-shadow:
		inset 0 0 0 1px rgb(255 255 255 / 0.45),
		0 1px 0 rgb(0 0 0 / 0.35);
}

.pkmn-badge--muted {
	background-color: var(--ui-bg-elevated);
	background-image: none;
	box-shadow:
		inset 0 0 0 1px rgb(255 255 255 / 0.08),
		0 1px 0 rgb(0 0 0 / 0.25);
	color: var(--ui-text-muted);
}
</style>
