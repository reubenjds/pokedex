import fs from "fs";

const fileData = fs.readFileSync("FirstGenPokemon.csv", "utf-8");

const splitLines = fileData.split("\n");

const jsonArray = [];

for (let i = 1; i < splitLines.length - 1; i++) {
	const splitEntry = splitLines[i].split(",");

	const types = [];
	const pokedexNumber = parseInt(splitEntry[0]);

	let spriteBigLink = "";

	if (pokedexNumber < 10) {
		spriteBigLink =
			"https://assets.pokemon.com/assets/cms2/img/pokedex/full/" +
			"00" +
			String(pokedexNumber) +
			".png";
	} else if (pokedexNumber < 100) {
		spriteBigLink =
			"https://assets.pokemon.com/assets/cms2/img/pokedex/full/" +
			"0" +
			String(pokedexNumber) +
			".png";
	} else {
		spriteBigLink =
			"https://assets.pokemon.com/assets/cms2/img/pokedex/full/" +
			String(pokedexNumber) +
			".png";
	}

	if (parseInt(splitEntry[2]) === 2) {
		types.push(splitEntry[3]);
		types.push(splitEntry[4]);
	} else {
		types.push(splitEntry[3]);
	}

	var isLegendary = false;
	if (parseInt(splitEntry[34]) === 1) {
		isLegendary = true;
	}

	const baseStats = {};
	const typeAgainst = {};

	let stats = ["HP", "Attack", "Defense", "Special", "Speed"];
	for (let index = 13; index < 18; index++) {
		baseStats[stats[index - 13]] = splitEntry[index];
	}

	let ts = [
		"Normal_Dmg",
		"Fire_Dmg",
		"Water_Dmg",
		"Eletric_Dmg",
		"Grass_Dmg",
		"Ice_Dmg",
		"Fight_Dmg",
		"Poison_Dmg",
		"Ground_Dmg",
		"Flying_Dmg",
		"Psychic_Dmg",
		"Bug_Dmg",
		"Rock_Dmg",
		"Ghost_Dmg",
		"Dragon_Dmg",
	];
	for (let index = 18; index < 33; index++) {
		typeAgainst[ts[index - 18]] = splitEntry[index];
	}

	const spriteSmallLink =
		"https://img.pokemondb.net/sprites/sword-shield/icon/" +
		String(splitEntry[1]).toLowerCase() +
		".png";

	const dexData = {
		pokedexNumber,
		name: splitEntry[1],
		spriteSmallLink,
		spriteBigLink,
		types,
		isLegendary,
		height: parseFloat(splitEntry[5]),
		weight: parseFloat(splitEntry[6]),
		malePercent: parseFloat(splitEntry[7]),
		captureRate: parseFloat(splitEntry[9]),
		baseTotal: parseInt(splitEntry[12]),
		baseStats,
		typeAgainst,
	};

	jsonArray.push(dexData);
}

fs.writeFileSync("pokemon.json", JSON.stringify(jsonArray));
