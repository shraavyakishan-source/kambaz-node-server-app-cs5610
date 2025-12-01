import { v4 as uuidv4 } from "uuid";
import CourseModel from "../Courses/model.js";

export default function QuizzesDao() {
  async function findQuizzesForCourse(courseId) {
    const course = await CourseModel.findById(courseId).exec();
    if (!course) return [];
    return course.quizzes || [];
  }

  // Fetch a single quiz by ID (returns subdoc)
  async function findQuizById(quizId) {
    // Find course that contains the quiz subdoc
    const course = await CourseModel.findOne({ "quizzes._id": quizId }).exec();
    if (!course) return null;
    // return the subdocument (Mongoose subdoc or plain object)
    return (
      course.quizzes.id(quizId) || course.quizzes.find((q) => q._id === quizId)
    );
  }

  async function createQuiz(courseId, quizData) {
    const course = await CourseModel.findById(courseId).exec();
    if (!course) throw new Error("Course not found");

    const newQuiz = {
      _id: quizData._id || uuidv4(),
      title: quizData.title || "Untitled Quiz",
      description: quizData.description || "",
      course: courseId,
      points: quizData.points ?? 20,
      numQuestions: quizData.numQuestions ?? 0,
      published: quizData.published ?? false,
      quizType: quizData.quizType || "Graded Quiz",
      assignmentGroup: quizData.assignmentGroup || "Quizzes",
      shuffleAnswers: quizData.shuffleAnswers ?? true,
      timeLimit: quizData.timeLimit ?? 20,
      multipleAttempts: quizData.multipleAttempts ?? false,
      showCorrectAnswers: quizData.showCorrectAnswers || "Never",
      accessCode: quizData.accessCode || "",
      oneQuestionAtATime: quizData.oneQuestionAtATime ?? true,
      webcamRequired: quizData.webcamRequired ?? false,
      lockQuestions: quizData.lockQuestions ?? false,
      availableDate: quizData.availableDate || "",
      untilDate: quizData.untilDate || "",
      dueDate: quizData.dueDate || "",
      status: quizData.status || "Draft",
    };

    course.quizzes.push(newQuiz);
    await course.save();
    return newQuiz;
  }

  async function updateQuiz(quizId, updates) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId }).exec();
    if (!course) throw new Error("Quiz not found");

    const quiz =
      course.quizzes.id(quizId) || course.quizzes.find((q) => q._id === quizId);
    if (!quiz) throw new Error("Quiz not found");

    Object.assign(quiz, updates);
    await course.save();
    // return updated subdoc
    return (
      course.quizzes.id(quizId) || course.quizzes.find((q) => q._id === quizId)
    );
  }

  async function deleteQuiz(quizId) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId }).exec();
    if (!course) throw new Error("Quiz not found");

    const before = course.quizzes.length;
    course.quizzes = course.quizzes.filter((q) => q._id !== quizId);
    await course.save();
    return { deletedCount: before - course.quizzes.length };
  }

  async function togglePublish(quizId) {
    const course = await CourseModel.findOne({ "quizzes._id": quizId }).exec();
    if (!course) throw new Error("Quiz not found");

    const quiz =
      course.quizzes.id(quizId) || course.quizzes.find((q) => q._id === quizId);
    if (!quiz) throw new Error("Quiz not found");

    quiz.published = !quiz.published;
    await course.save();
    return quiz;
  }

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    togglePublish,
  };
}
