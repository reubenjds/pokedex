/** @format */

import fs from "fs";
import maxStat from "./maxStats.json" assert { type: "json" };
import evolution from "./evolutions.json" assert { type: "json" };
import pokemonData from "./db.js";

const fileData = fs.readFileSync("FirstGenPokemon.csv", "utf-8");

const splitLines = fileData.split("\n");

const jsonArray = [];

const p = [
	"Bulbasaur",
	"Ivysaur",
	"Venusaur",
	"Charmander",
	"Charmeleon",
	"Charizard",
	"Squirtle",
	"Wartortle",
	"Blastoise",
	"Caterpie",
	"Metapod",
	"Butterfree",
	"Weedle",
	"Kakuna",
	"Beedrill",
	"Pidgey",
	"Pidgeotto",
	"Pidgeot",
	"Rattata",
	"Raticate",
	"Spearow",
	"Fearow",
	"Ekans",
	"Arbok",
	"Pikachu",
	"Raichu",
	"Sandshrew",
	"Sandslash",
	"Nidoran",
	"Nidorina",
	"Nidoqueen",
	"Nidoran",
	"Nidorino",
	"Nidoking",
	"Clefairy",
	"Clefable",
	"Vulpix",
	"Ninetales",
	"Jigglypuff",
	"Wigglytuff",
	"Zubat",
	"Golbat",
	"Oddish",
	"Gloom",
	"Vileplume",
	"Paras",
	"Parasect",
	"Venonat",
	"Venomoth",
	"Diglett",
	"Dugtrio",
	"Meowth",
	"Persian",
	"Psyduck",
	"Golduck",
	"Mankey",
	"Primeape",
	"Growlithe",
	"Arcanine",
	"Poliwag",
	"Poliwhirl",
	"Poliwrath",
	"Abra",
	"Kadabra",
	"Alakazam",
	"Machop",
	"Machoke",
	"Machamp",
	"Bellsprout",
	"Weepinbell",
	"Victreebel",
	"Tentacool",
	"Tentacruel",
	"Geodude",
	"Graveler",
	"Golem",
	"Ponyta",
	"Rapidash",
	"Slowpoke",
	"Slowbro",
	"Magnemite",
	"Magneton",
	"Farfetchd",
	"Doduo",
	"Dodrio",
	"Seel",
	"Dewgong",
	"Grimer",
	"Muk",
	"Shellder",
	"Cloyster",
	"Gastly",
	"Haunter",
	"Gengar",
	"Onix",
	"Drowzee",
	"Hypno",
	"Krabby",
	"Kingler",
	"Voltorb",
	"Electrode",
	"Exeggcute",
	"Exeggutor",
	"Cubone",
	"Marowak",
	"Hitmonlee",
	"Hitmonchan",
	"Lickitung",
	"Koffing",
	"Weezing",
	"Rhyhorn",
	"Rhydon",
	"Chansey",
	"Tangela",
	"Kangaskhan",
	"Horsea",
	"Seadra",
	"Goldeen",
	"Seaking",
	"Staryu",
	"Starmie",
	"MrMime",
	"Scyther",
	"Jynx",
	"Electabuzz",
	"Magmar",
	"Pinsir",
	"Tauros",
	"Magikarp",
	"Gyarados",
	"Lapras",
	"Ditto",
	"Eevee",
	"Vaporeon",
	"Jolteon",
	"Flareon",
	"Porygon",
	"Omanyte",
	"Omastar",
	"Kabuto",
	"Kabutops",
	"Aerodactyl",
	"Snorlax",
	"Articuno",
	"Zapdos",
	"Moltres",
	"Dratini",
	"Dragonair",
	"Dragonite",
	"Mewtwo",
	"Mew",
];

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
	const strongAgainst = [];
	const weakAgainst = [];
	const evos = {};

	let stats = ["HP", "Attack", "Defense", "Special", "Speed"];
	for (let index = 13; index < 18; index++) {
		baseStats[stats[index - 13]] = splitEntry[index];
	}

	for (let index = 0; index < evolution[i - 1].length; index++) {
		evos[evolution[i - 1][index]] = p[parseInt(evolution[i - 1][index]) - 1];
	}

	let ts = [
		"Normal",
		"Fire",
		"Water",
		"Electric",
		"Grass",
		"Ice",
		"Fighting",
		"Poison",
		"Ground",
		"Flying",
		"Psychic",
		"Bug",
		"Rock",
		"Ghost",
		"Dragon",
	];
	for (let index = 18; index < 33; index++) {
		if (parseInt(splitEntry[index]) < 1) {
			if (types.includes(ts[index - 18].toLowerCase())) {
			} else {
				strongAgainst.push(ts[index - 18].toLowerCase());
			}
		} else if (parseInt(splitEntry[index]) >= 2) {
			weakAgainst.push(ts[index - 18].toLowerCase());
		}
	}

	const spriteSmallLink =
		"https://img.pokemondb.net/sprites/sword-shield/icon/" +
		String(splitEntry[1]).toLowerCase() +
		".png";

	const dexData = {
		pokedexNumber,
		name: splitEntry[1],
		evos,
		spriteSmallLink,
		spriteBigLink,
		types,
		isLegendary,
		height: parseFloat(splitEntry[5]),
		weight: parseFloat(splitEntry[6]),
		malePercent: parseFloat(splitEntry[7]),
		femalePercent: parseFloat(splitEntry[8]),
		captureRate: parseFloat(splitEntry[9]),
		baseTotal: parseInt(splitEntry[12]),
		baseStats,
		maxStats: maxStat[i - 1],
		strongAgainst,
		weakAgainst,
		abilities: pokemonData[i - 1].abilities,
	};

	jsonArray.push(dexData);
}

fs.writeFileSync("pokemon.json", JSON.stringify(jsonArray));
