import express from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.listen(4040, () => console.log("Server running on port 4040"));
