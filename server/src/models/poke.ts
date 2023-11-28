import mongoose, { model } from "mongoose";

const pokeSchema = new mongoose.Schema({
	pokedexNumber: Number,
	name: String,
	evos: {
		type: Map,
		of: String,
	},
	spriteSmallLink: String,
	spriteBigLink: String,
	types: [String],
	isLegendary: Boolean,
	height: Number,
	weight: Number,
	malePercent: Number,
	femalePercent: Number,
	captureRate: Number,
	baseTotal: Number,
	baseStats: {
		type: Map,
		of: String,
	},
	maxStats: {
		type: Map,
		of: Number,
	},
	strongAgainst: [String],
	weakAgainst: [String],
	abilities: [String],
});

export default mongoose.model("Poke", pokeSchema, "generation1");
