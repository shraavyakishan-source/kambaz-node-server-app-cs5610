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
    const user = req.session?.currentUser;

    if (!user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    if (user.role !== "STUDENT") {
      return res
        .status(403)
        .json({ message: "Only students can start a quiz" });
    }

    const { cid, qid } = req.params;

    try {
      const quiz = await dao.findQuizById(qid);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      // ✅ Reuse existing in-progress attempt
      const existingAttempt = await QuizAttempt.findOne({
        student: user._id,
        course: cid,
        quiz: qid,
        status: "IN_PROGRESS",
      });

      if (existingAttempt) {
        return res.json({ attemptId: existingAttempt._id });
      }

      // ✅ Count completed attempts
      const attemptCount = await QuizAttempt.countDocuments({
        student: user._id,
        course: cid,
        quiz: qid,
        status: "COMPLETED",
      });

      // ✅ Block attempts if limit reached
      if (!quiz.multipleAttempts && attemptCount >= 1) {
        return res
          .status(403)
          .json({ message: "You have already taken this quiz" });
      }

      if (quiz.multipleAttempts && attemptCount >= quiz.howManyAttempts) {
        return res
          .status(403)
          .json({ message: "You have used all allowed attempts" });
      }

      // ✅ Create new attempt
      const newAttempt = await QuizAttempt.create({
        student: user._id,
        course: cid,
        quiz: qid,
        attemptNumber: attemptCount + 1,
        answers: [],
        status: "IN_PROGRESS",
      });

      res.json({ attemptId: newAttempt._id });
    } catch (err) {
      console.error("❌ START QUIZ ERROR:", err);
      res.status(500).json({ message: "Failed to start quiz" });
    }
  });
  // ✅ SUBMIT QUIZ ATTEMPT
  app.put("/api/quiz-attempts/:attemptId/submit", async (req, res) => {
    try {
      const { attemptId } = req.params;
      const { answers, score } = req.body;

      const updated = await QuizAttempt.findByIdAndUpdate(
        attemptId,
        {
          answers,
          score,
          status: "COMPLETED",
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: "Attempt not found" });
      }

      res.json(updated);
    } catch (err) {
      console.error("❌ SUBMIT ERROR:", err);
      res.status(500).json({ message: "Failed to submit attempt" });
    }
  });

  // ✅ GET LAST COMPLETED ATTEMPT
  app.get("/api/courses/:cid/quizzes/:qid/last-attempt", async (req, res) => {
    const user = req.session?.currentUser;
    if (!user) return res.status(401).json({ message: "Not logged in" });

    try {
      const attempt = await QuizAttempt.findOne({
        student: user._id,
        course: req.params.cid,
        quiz: req.params.qid,
        status: "COMPLETED",
      }).sort({ attemptNumber: -1 });

      if (!attempt) return res.json(null);
      res.json(attempt);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to load last attempt" });
    }
  });
}
