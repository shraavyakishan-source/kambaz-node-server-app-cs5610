import QuizzesDao from "./dao.js";
import QuestionsDao from "./questions.dao.js";
import { QuizAttempt } from "./model.js";

export default function QuizRoutes(app) {
  const dao = QuizzesDao();
  const questionsDao = QuestionsDao();

  // CREATE quiz (POST) — keep before other routes if route order matters
  app.post("/api/courses/:courseId/quizzes", async (req, res) => {
    try {
      const newQuiz = await dao.createQuiz(req.params.courseId, req.body);
      res.status(201).json(newQuiz);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

  // GET all quizzes for a course
  app.get("/api/courses/:courseId/quizzes", async (req, res) => {
    try {
      const quizzes = await dao.findQuizzesForCourse(req.params.courseId);
      res.json(quizzes);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

  // GET single quiz by ID (works with embedded quiz DAO)
  app.get(
    "/api/courses/:courseId/quizzes/:quizId",

    async (req, res) => {
      try {
        const quiz = await dao.findQuizById(req.params.quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        // Fetch related questions
        const questions = await questionsDao.findQuestionsForQuiz(
          req.params.quizId
        );

        res.json({
          ...(quiz.toObject?.() ?? quiz),
          questions,
          numQuestions: questions.length,
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
      }
    }
  );

  // UPDATE quiz
  app.put(
    "/api/quizzes/:quizId",

    async (req, res) => {
      try {
        const updatedQuiz = await dao.updateQuiz(req.params.quizId, req.body);
        res.json(updatedQuiz);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
      }
    }
  );

  // DELETE quiz
  app.delete("/api/quizzes/:quizId", async (req, res) => {
    try {
      const result = await dao.deleteQuiz(req.params.quizId);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

  // TOGGLE publish
  app.put("/api/quizzes/:quizId/publish", async (req, res) => {
    try {
      const quiz = await dao.togglePublish(req.params.quizId);
      res.json(quiz);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

  app.post("/api/courses/:cid/quizzes/:qid/start", async (req, res) => {
    console.log("✅ START QUIZ ROUTE HIT");

    const user = req.session?.currentUser;
    console.log("User from session:", user);

    if (!user) {
      return res.status(401).json({ message: "Not logged in" });
    }
    if (user.role !== "STUDENT") {
      return res
        .status(403)
        .json({ message: "Only students can start a quiz" });
    }

    const { cid, qid } = req.params;
    console.log("CID:", cid, "QID:", qid);

    try {
      const existing = await QuizAttempt.findOne({
        student: user._id,
        course: cid,
        quiz: qid,
        status: "IN_PROGRESS",
      });

      console.log("Existing attempt:", existing);

      const attempt = await QuizAttempt.create({
        student: user._id,
        course: cid,
        quiz: qid,
        answers: [],
        status: "IN_PROGRESS",
      });

      console.log("Created attempt:", attempt);

      res.json({ attemptId: attempt._id });
    } catch (err) {
      console.error("❌ START QUIZ ERROR:", err);
      res.status(500).json({ message: "Failed to start quiz" });
    }
  });
}
