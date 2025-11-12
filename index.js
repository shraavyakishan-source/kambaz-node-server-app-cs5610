import express from "express";
import cors from "cors";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";

const app = express(); // ✅ must come before any use of `app`

// ✅ Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// ✅ Mount your routes/modules
Hello(app);
Lab5(app);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
