import fs from "fs";

const fileData = fs.readFileSync("FirstGenPokemon.csv", "utf-8");

const splitLines = fileData.split("\n");

const jsonArray = [];

for (let i = 1; i < splitLines.length; i++) {
	const splitEntry = splitLines[i].split(",");

	const types = [];

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

	const baseStats = [];
	const typeAgainst = [];
	//  HP	 Attack	 Defense	 Special	 Speed
	for (let index = 13; index < 18; index++) {
		baseStats.push(splitEntry[index]);
	}
	//  Normal_Dmg	 Fire_Dmg	 Water_Dmg	 Eletric_Dmg	 Grass_Dmg	 Ice_Dmg	 Fight_Dmg	 Poison_Dmg	 Ground_Dmg	 Flying_Dmg	 Psychic_Dmg	 Bug_Dmg	 Rock_Dmg	 Ghost_Dmg	 Dragon_Dmg
	for (let index = 18; index < 33; index++) {
		typeAgainst.push(splitEntry[index]);
	}

	const dexData = {
		pokdexNumber: splitEntry[0],
		name: splitEntry[1],
		types,
		isLegendary,
		height: parseInt(splitEntry[5]),
		weight: parseInt(splitEntry[6]),
		malePercent: parseInt(splitEntry[7]),
		captureRate: parseInt(splitEntry[9]),
		baseTotal: parseInt(splitEntry[12]),
		baseStats,
		typeAgainst,
	};

	jsonArray.push(dexData);
}

fs.writeFileSync("pokemon.json", JSON.stringify(jsonArray));
