export const POKEMON_TYPES: PokemonType[] = [
	"normal",
	"fire",
	"water",
	"electric",
	"grass",
	"ice",
	"fighting",
	"poison",
	"ground",
	"flying",
	"psychic",
	"bug",
	"rock",
	"ghost",
	"dragon",
	"dark",
	"steel",
	"fairy",
];

export const GENERATIONS = [
	{ value: 1, label: "I", region: "Kanto" },
	{ value: 2, label: "II", region: "Johto" },
	{ value: 3, label: "III", region: "Hoenn" },
	{ value: 4, label: "IV", region: "Sinnoh" },
	{ value: 5, label: "V", region: "Unova" },
	{ value: 6, label: "VI", region: "Kalos" },
	{ value: 7, label: "VII", region: "Alola" },
	{ value: 8, label: "VIII", region: "Galar" },
	{ value: 9, label: "IX", region: "Paldea" },
];

export const STAT_LABELS: Record<StatKey, string> = {
	hp: "HP",
	attack: "Attack",
	defense: "Defense",
	spAtk: "Sp. Atk",
	spDef: "Sp. Def",
	speed: "Speed",
};

export const PAGE_SIZE = 24;

/**
 * Type colours, tuned for a dark UI. Each one is the most saturated version of
 * the official hue that still clears WCAG AAA (7:1) against the near-black
 * label printed on it, so every chip carries identical contrast. Derived by
 * raising OKLCH lightness — see the palette notes in the README.
 */
export const TYPE_COLORS: Record<PokemonType, string> = {
	bug: "#9dad09",
	dark: "#bc9e89",
	dragon: "#a296fe",
	electric: "#c2a10d",
	fairy: "#e7879e",
	fighting: "#fd7e6f",
	fire: "#ff811d",
	flying: "#ae92fe",
	ghost: "#b396e6",
	grass: "#5cb91d",
	ground: "#c49f30",
	ice: "#65b0b0",
	normal: "#a7a76f",
	poison: "#eb77ea",
	psychic: "#fe799c",
	rock: "#bea217",
	steel: "#a2a2bd",
	water: "#7aa2fe",
};

/** The label printed on a type chip. Matches Nuxt UI's `text-inverted`. */
export const TYPE_INK = "#18181b";

/**
 * Stat bars are graphics, not text, so they only need 3:1 against the track.
 * Kept deliberately muted: the bar length carries the meaning, not the hue.
 */
export const STAT_COLORS: Record<StatKey, string> = {
	hp: "#4ade80",
	attack: "#f87171",
	defense: "#60a5fa",
	spAtk: "#f472b6",
	spDef: "#2dd4bf",
	speed: "#facc15",
};

/** The highest base stat in the dex (Blissey's 255), used to scale stat bars. */
export const MAX_BASE_STAT = 255;

/** Placeholder for the handful of forms PokéAPI has no sprite for. */
export const SPRITE_FALLBACK = "/sprites/0.png";

export const SORT_OPTIONS = [
	{ value: "dex", label: "Dex number" },
	{ value: "name", label: "Name (A–Z)" },
	{ value: "total", label: "Base stat total" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export const isSortKey = (value: unknown): value is SortKey =>
	SORT_OPTIONS.some((option) => option.value === value);

export const titleCase = (value: string) =>
	value.replace(/(^|[\s-])([a-z])/g, (_, prefix, letter) => prefix + letter.toUpperCase());
