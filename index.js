import express from "express";
import cors from "cors";
import "dotenv/config";
import session from "express-session";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/Database/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";

const app = express();

// --------------------------------------------
// ✅ CORS (must be FIRST and credentials:true)
// --------------------------------------------
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      process.env.CLIENT_URL, // your Vercel URL
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(express.json());

// --------------------------------------------
// ✅ EXPRESS-SESSION (Fix for Vercel + Render)
// --------------------------------------------
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "none", // REQUIRED for cross-site
    secure: true, // REQUIRED on Render (HTTPS)
  },
};

// Render runs behind a proxy → must enable trust proxy
app.set("trust proxy", 1);

app.use(session(sessionOptions));

// --------------------------------------------
// ROUTES
// --------------------------------------------
UserRoutes(app, db);
CourseRoutes(app, db);
Hello(app);
Lab5(app);

// --------------------------------------------
// START SERVER
// --------------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
