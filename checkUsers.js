import mongoose from "mongoose";
import User from "./Kambaz/Users/model.js"; // adjust path

const CONNECTION_STRING = "mongodb://127.0.0.1:27017/Kambaz"; // same as server

mongoose
  .connect(CONNECTION_STRING)
  .then(async () => {
    console.log("Connected to DB:", mongoose.connection.name);

    const allUsers = await User.find();
    console.log("All users in DB:", allUsers);

    process.exit();
  })
  .catch(console.error);
