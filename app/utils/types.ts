export type { PokedexEntry, Pokemon, PokemonType, StatKey, Stats };

declare global {
	type PokemonType =
		| "bug"
		| "dark"
		| "dragon"
		| "electric"
		| "fairy"
		| "fighting"
		| "fire"
		| "flying"
		| "ghost"
		| "grass"
		| "ground"
		| "ice"
		| "normal"
		| "poison"
		| "psychic"
		| "rock"
		| "steel"
		| "water";

	type StatKey = "hp" | "attack" | "defense" | "spAtk" | "spDef" | "speed";

	type Stats = Record<StatKey, number>;

	/** Light record from `/pokedex/index.json`, used by the list and its filters. */
	type PokedexEntry = {
		slug: string;
		dexNumber: number;
		name: string;
		types: PokemonType[];
		generation: number;
		spriteSmall: string | null;
		isDefault: boolean;
		isLegendary: boolean;
		isMythical: boolean;
		baseTotal: number;
	};

	/** Full record from `/pokedex/<slug>.json`, used by the detail page. */
	type Pokemon = PokedexEntry & {
		speciesSlug: string;
		spriteBig: string | null;
		height: number;
		weight: number;
		malePercent: number;
		femalePercent: number;
		captureRate: number;
		baseStats: Stats;
		maxStats: Stats;
		strongAgainst: PokemonType[];
		weakAgainst: PokemonType[];
		abilities: { name: string; isHidden: boolean }[];
		evolutions: {
			slug: string;
			name: string;
			dexNumber: number;
			spriteSmall: string | null;
		}[];
		forms: { slug: string; name: string; isDefault: boolean }[];
	};
}
