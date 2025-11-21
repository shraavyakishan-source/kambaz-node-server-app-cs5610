import mongoose from "mongoose";
import User from "./Kambaz/Users/model.js";

async function addTestUser() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/kambazDB");

    // Check if the user already exists
    const existingUser = await User.findOne({ username: "test" });
    if (existingUser) {
      console.log("Test user already exists:", existingUser);
      return;
    }

    const user = await User.create({
      username: "iron_man",
      password: "stark123",
    });

    console.log("Test user created:", user);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

addTestUser();
