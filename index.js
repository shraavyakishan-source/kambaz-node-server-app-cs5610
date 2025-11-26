import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModulesRoutes from "./Kambaz/Modules/routes.js";
import EnrollmentsRoutes from "./Kambaz/Enrollments/routes.js";
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import db from "./Kambaz/Database/index.js";

// ----------------------
// MongoDB Connection
// ----------------------
const CONNECTION_STRING =
  process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/Kambaz";

mongoose
  .connect(CONNECTION_STRING)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    console.log("Connected database name:", mongoose.connection.name); // <-- move inside .then()
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
// ----------------------
// Express App
// ----------------------
const app = express();
app.use(express.json());

// Debug: log environment variables
console.log("CLIENT_URL from env:", process.env.CLIENT_URL);

// ----------------------
// CORS + Session
// ----------------------
const isProduction = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://kambaz-next-js-a6-git-a6-shraavya-b-ks-projects.vercel.app",
    ],
    credentials: true,
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24,
  },
};

app.use(session(sessionOptions));

// Optional: debug incoming origins
app.use((req, res, next) => {
  console.log("Incoming request from origin:", req.headers.origin);
  next();
});

// ----------------------
// Routes
// ----------------------
UserRoutes(app, db);
CourseRoutes(app, db);
ModulesRoutes(app, db);
EnrollmentsRoutes(app, db);
Hello(app);
Lab5(app);

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
