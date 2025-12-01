import mongoose from "mongoose";
import quizSchema from "./schema.js";

// model name 'Quiz', explicit collection 'quizzes'
const QuizModel = mongoose.model("Quiz", quizSchema, "quizzes");
export default QuizModel;
