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
// ✅ Body parser middleware for JSON
// --------------------------------------------
app.use(express.json());

// --------------------------------------------
// ✅ Debug: Check CLIENT_URL env
// --------------------------------------------
console.log("CLIENT_URL from env:", process.env.CLIENT_URL);

// --------------------------------------------
// ✅ CORS (must be BEFORE routes & credentials:true)
// --------------------------------------------
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.CLIENT_URL],
    credentials: true, // allow cookies/sessions
  })
);

// Optional: Debug incoming origins
app.use((req, res, next) => {
  console.log("Incoming request from origin:", req.headers.origin);
  next();
});

// --------------------------------------------
// ✅ EXPRESS-SESSION (works with Render + HTTPS)
// --------------------------------------------
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: "none", // required for cross-site cookies
    secure: true, // required on Render (HTTPS)
  },
};

// Trust proxy (needed for secure cookies behind Render proxy)
app.set("trust proxy", 1);

app.use(session(sessionOptions));

// --------------------------------------------
// ✅ ROUTES
// --------------------------------------------
UserRoutes(app, db);
CourseRoutes(app, db);
Hello(app);
Lab5(app);

// --------------------------------------------
// ✅ START SERVER
// --------------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
