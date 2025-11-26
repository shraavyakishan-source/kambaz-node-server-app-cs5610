import express from "express";
import EnrollmentsDao from "../Enrollments/dao.js";
import model from "../Enrollments/model.js";

export default function EnrollmentsRoutes(app, db) {
  const dao = EnrollmentsDao(db);
  const router = express.Router();

  // --- Enroll current user ---
  router.post("/enroll/:courseId", async (req, res) => {
    try {
      const userId = req.session.currentUser._id;
      const { courseId } = req.params;

      const enrollment = await dao.enrollUserInCourse(userId, courseId);
      res.json(enrollment);
    } catch (err) {
      console.error("Enroll error:", err);
      res.status(500).json({ error: "Enroll failed" });
    }
  });

  // --- Unenroll current user ---
  router.delete("/unenroll/:courseId", async (req, res) => {
    try {
      const userId = req.session.currentUser._id;
      const { courseId } = req.params;

      await dao.unenrollUserFromCourse(userId, courseId);
      res.json({ success: true });
    } catch (err) {
      console.error("Unenroll error:", err);
      res.status(500).json({ error: "Unenroll failed" });
    }
  });

  router.get("/enrollments/current", async (req, res) => {
    try {
      const userId = req.session.currentUser._id;
      const enrollments = await model.find({ user: userId });
      res.json(enrollments);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to load enrollments" });
    }
  });

  app.use("/api/courses", router);
}
