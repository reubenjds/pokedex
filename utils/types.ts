export type { Pokemon };

declare global {
	type Pokemon = {
		pokedexNumber: number;
		name: string;
		evos: {};
		spriteSmallLink: string;
		spriteBigLink: string;
		types: string[];
		isLegendary: boolean;
		height: number;
		weight: number;
		malePercent: number;
		femalePercent: number;
		captureRate: number;
		baseTotal: number;
		baseStats: {
			HP: number;
			Attack: number;
			Defense: number;
			Special: number;
			Speed: number;
		};
		maxStats: {
			maxHealth: number;
			maxAttack: number;
			maxDefense: number;
			maxSpAtk: number;
			maxSpeed: number;
		};
		strongAgainst: string[];
		weakAgainst: string[];
		abilities: string[];
	};
}
