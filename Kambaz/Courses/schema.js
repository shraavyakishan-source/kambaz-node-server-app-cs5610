import mongoose from "mongoose";
import moduleSchema from "../Modules/schema.js";
import QuizSchema from "../Quizzes/schema.js";

const courseSchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    number: String,
    credits: Number,
    description: String,
    modules: [moduleSchema],
    quizzes: {
      type: [QuizSchema],
      default: [],
    },
  },
  { collection: "courses" }
);
export default courseSchema;
