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

// ✅ Enable CORS and JSON parsing middleware
app.use(
  cors({
    credentials: true, // supports cookies
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);
app.use(express.json()); // only once

// ✅ Configure session BEFORE routes
const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}

app.use(session(sessionOptions));

// ✅ Mount your routes AFTER configuring session
UserRoutes(app, db);
CourseRoutes(app, db);
Hello(app);
Lab5(app);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
