export { Pokemon };

declare global {
	type Pokemon = {
		pokedexNumber: number;
		name: string;
		evolutions: string[];
		spriteSmallLink: string;
		spriteBigLink: string;
		types: string[];
		isLegendary: boolean;
		height: number;
		weight: number;
		malePercent: number;
		captureRate: number;
		baseTotal: number;
		baseStats: {};
		maxStats: {};
		typeAgainst: {};
	};
}
