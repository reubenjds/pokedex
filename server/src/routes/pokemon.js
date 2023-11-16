import express from "express";
import Poke from "../models/poke.js";

const router = express.Router();

//module.exports = router;

// Get all pokemon
router.get("/", async (req, res) => {
	try {
		const pokemon = await Poke.find();
		res.json(pokemon);
	} catch (error) {
		res.status(500).json({ error });
	}
});

// Get pokemon by dex number
router.get("/:dexNumber", async (req, res) => {
	const pokemon = await Poke.findOne({ pokedexNumber: req.params.dexNumber });
	res.json(pokemon);
});

export { router as pokemonRouter };
