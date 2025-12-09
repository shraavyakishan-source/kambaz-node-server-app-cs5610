import mongoose from "mongoose";
import { quizSchema, questionSchema } from "./schema.js";

// Quiz model
const QuizModel = mongoose.model("Quiz", quizSchema, "quizzes");

// Question model
const QuestionModel = mongoose.model("Question", questionSchema, "questions");

export { QuizModel, QuestionModel };
