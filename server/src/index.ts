import express from "express";
import cors from "cors";
import mongoose, { type ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import { pokemonRouter } from "./routes/pokemon";

dotenv.config();

mongoose.connect(process.env.DATABASE_URL!, {
	useNewUrlParser: true,
} as ConnectOptions);
const db = mongoose.connection;
db.on("error", (e) => console.error(e));
db.once("open", () => console.log("Connected to server"));

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use("/pokemon", pokemonRouter);

app.listen(4040, () => console.log("Server running on port 4040"));
