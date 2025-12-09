import { v4 as uuidv4 } from "uuid";
import { QuestionModel } from "./model.js";

export default function QuestionsDao() {
  async function createQuestion(quizId, questionData) {
    const newQuestion = {
      _id: uuidv4(),
      quiz: quizId,
      type: questionData.type || "multiple-choice",
      text: questionData.text?.trim() || "Untitled Question",
      options: questionData.options ?? [],
      answer: questionData.answer?.trim() || " ",
      points: questionData.points ?? 1,
    };

    return await QuestionModel.create(newQuestion);
  }

  async function findQuestionsForQuiz(quizId) {
    const questions = await QuestionModel.find({ quiz: quizId }).lean().exec();
    return questions.map((q) => ({
      ...q,
      id: q._id,
    }));
  }

  async function findQuestionById(questionId) {
    const q = await QuestionModel.findById(questionId).lean().exec();
    if (!q) return null;
    return { ...q, id: q._id };
  }

  async function updateQuestion(questionId, updates) {
    const updated = await QuestionModel.findByIdAndUpdate(
      questionId,
      {
        $set: {
          type: updates.type,
          text: updates.text ?? "",
          options: updates.options ?? [],
          answer: updates.answer ?? "",
          points: updates.points ?? 1,
        },
      },
      { new: true }
    )
      .lean()
      .exec();

    if (!updated) throw new Error("Question not found");
    return updated;
  }

  async function deleteQuestion(questionId) {
    const deleted = await QuestionModel.findByIdAndDelete(questionId)
      .lean()
      .exec();
    if (!deleted) throw new Error("Question not found");
    return deleted;
  }

  return {
    createQuestion,
    findQuestionsForQuiz,
    findQuestionById,
    updateQuestion,
    deleteQuestion,
  };
}
