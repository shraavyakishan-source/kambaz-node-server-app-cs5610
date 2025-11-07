import express from "express";
import Hello from "./Hello.js"; // import the Hello route module

const app = express();

// pass app reference to Hello.js to register routes
Hello(app);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
