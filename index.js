import express from "express";
import cors from "cors";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";

const app = express();

// enable CORS for all origins (development-friendly)
app.use(cors());
app.use(express.json());

Hello(app);
Lab5(app);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
