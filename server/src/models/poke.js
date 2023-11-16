import mongoose, { model } from "mongoose";

const pokeSchema = new mongoose.Schema({
	pokedexNumber: Number,
	name: String,
	evolutions: [String],
	spriteSmallLink: String,
	spriteBigLink: String,
	types: [String],
	isLegendary: Boolean,
	height: Number,
	weight: Number,
	malePercent: Number,
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
	typeAgainst: {
		type: Map,
		of: String,
	},
});

export default model.exports = mongoose.model(
	"Poke",
	pokeSchema,
	"generation1"
);
