import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },

    title: String,
    description: String,
    quizType: { type: String, default: "Graded Quiz" },
    assignmentGroup: { type: String, default: "Quizzes" },
    points: { type: Number, default: 0 },
    course: { type: String, required: true },

    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 0 },
    multipleAttempts: { type: Boolean, default: false },
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

  {
    _id: false, // tells mongoose NOT to create ObjectId for nested docs
    collection: "quizzes",
  }
);

export default quizSchema;
