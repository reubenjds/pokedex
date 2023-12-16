import express from "express";
import Poke from "../models/poke";

const router = express.Router();

// Get all pokemon
router.get("/", async (req, res) => {
	try {
		const pokemon = await Poke.find()
			.limit(10)
			.skip(10 * (req.query.page as any));
		res.json(pokemon);
	} catch (error) {
		res.status(500).json({ error });
	}
});

router.get("/search", async (req, res) => {
	try {
		const pokemon = await Poke.find({
			name: { $regex: new RegExp(`^${req.query.name}`, "i") },
		});
		res.json(pokemon);
	} catch (error) {
		res.status(500).json({ error });
	}
});

// Get pokemon by dex number
router.get("/:dexNumber", async (req, res) => {
	try {
		const pokemon = await Poke.findOne({ pokedexNumber: req.params.dexNumber });
		res.json(pokemon);
	} catch (error) {
		res.status(500).json({ error });
	}
});

export { router as pokemonRouter };
