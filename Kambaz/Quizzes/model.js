import mongoose from "mongoose";
import { quizSchema, questionSchema, quizAttemptSchema } from "./schema.js";

export const QuizModel = mongoose.model("Quiz", quizSchema, "quizzes");
export const QuestionModel = mongoose.model(
  "Question",
  questionSchema,
  "questions"
);

// ✅ NEW model
export const QuizAttempt = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema,
  "quiz_attempts"
);
