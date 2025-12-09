import QuestionsDao from "./questions.dao.js";

export default function QuestionRoutes(app) {
  const dao = QuestionsDao();

  // CREATE a question
  app.post("/api/quizzes/:quizId/questions", async (req, res) => {
    try {
      const question = await dao.createQuestion(req.params.quizId, req.body);
      res.status(201).json(question);
    } catch (err) {
      console.error("Create question failed:", err);
      res.status(500).json({ message: err.message });
    }
  });

  // GET all questions for a quiz
  app.get("/api/quizzes/:quizId/questions", async (req, res) => {
    try {
      const questions = await dao.findQuestionsForQuiz(req.params.quizId);
      res.json(questions);
    } catch (err) {
      console.error("Get questions failed:", err);
      res.status(500).json({ message: err.message });
    }
  });

  // GET a single question
  app.get("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
    try {
      const question = await dao.findQuestionById(req.params.questionId);
      if (!question)
        return res.status(404).json({ message: "Question not found" });

      // Optional: verify the question belongs to this quiz
      if (question.quiz.toString() !== req.params.quizId) {
        return res
          .status(400)
          .json({ message: "Question does not belong to this quiz" });
      }

      res.json(question);
    } catch (err) {
      console.error("Get question failed:", err);
      res.status(500).json({ message: err.message });
    }
  });

  // UPDATE a question
  app.put("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
    try {
      const question = await dao.findQuestionById(req.params.questionId);
      if (!question)
        return res.status(404).json({ message: "Question not found" });

      // Optional: verify quiz ownership
      if (question.quiz.toString() !== req.params.quizId) {
        return res
          .status(400)
          .json({ message: "Question does not belong to this quiz" });
      }

      const updated = await dao.updateQuestion(req.params.questionId, req.body);
      res.json(updated);
    } catch (err) {
      console.error("Update question failed:", err);
      res.status(500).json({ message: err.message });
    }
  });

  // DELETE a question
  app.delete("/api/quizzes/:quizId/questions/:questionId", async (req, res) => {
    try {
      const question = await dao.findQuestionById(req.params.questionId);
      if (!question)
        return res.status(404).json({ message: "Question not found" });

      if (question.quiz.toString() !== req.params.quizId) {
        return res
          .status(400)
          .json({ message: "Question does not belong to this quiz" });
      }

      const result = await dao.deleteQuestion(req.params.questionId);
      res.json(result);
    } catch (err) {
      console.error("Delete question failed:", err);
      res.status(500).json({ message: err.message });
    }
  });
}
