import mongoose from "mongoose";

// Quiz schema
export const quizSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: String,
    description: String,
    quizType: { type: String, default: "Graded Quiz" },
    assignmentGroup: { type: String, default: "Quizzes" },
    points: { type: Number, default: 0 },
    course: { type: String, required: true },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 0 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "Never" },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestions: { type: Boolean, default: false },
    dueDate: Date,
    availableDate: Date,
    untilDate: Date,
    numQuestions: { type: Number, default: 0 },
    published: { type: Boolean, default: false },
  },
  { _id: false, collection: "quizzes" }
);

// Question schema
export const questionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    quiz: { type: String, required: true },
    type: {
      type: String,
      enum: ["multiple-choice", "true-false", "fill-in-the-blank"],
      required: true,
    },
    text: { type: String, required: true },
    options: [{ type: String }],
    answer: { type: String, required: true },
    points: { type: Number, default: 1 },
  },
  { collection: "questions" }
);

// QuizAttempt schema
export const quizAttemptSchema = new mongoose.Schema(
  {
    student: { type: String, required: true },
    course: { type: String, required: true },
    quiz: { type: String, required: true },

    attemptNumber: { type: Number, required: true },
    answers: { type: Array, default: [] },
    score: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },

    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED"],
      default: "IN_PROGRESS",
    },
  },
  { collection: "quiz_attempts" }
);

export default quizSchema;
