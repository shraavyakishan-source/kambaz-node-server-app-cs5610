import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();

  // GET ALL COURSES
  app.get("/api/courses", async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  });

  // GET COURSES FOR ENROLLED USER
  app.get("/api/courses/enrolled/:userId", async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session.currentUser;
      if (!currentUser) return res.sendStatus(401);
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  });

  // CREATE COURSE + AUTO-ENROLL CREATOR
  app.post("/api/courses", async (req, res) => {
    const newCourse = await dao.createCourse(req.body);
    const currentUser = req.session.currentUser;
    if (currentUser) {
      await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    }
    res.json(newCourse);
  });

  // UPDATE COURSE
  app.put("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;
    const updatedCourse = await dao.updateCourse(courseId, req.body);
    res.json(updatedCourse);
  });

  // DELETE COURSE
  // Courses/routes.js
  app.delete("/api/courses/:courseId", async (req, res) => {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    try {
      console.log("Attempting to delete course:", courseId);

      // Unenroll all users
      const enrollmentsResult = await enrollmentsDao.unenrollAllUsersFromCourse(
        courseId
      );
      console.log("Enrollments removed:", enrollmentsResult.deletedCount);

      // Delete course
      const deleteResult = await dao.deleteCourse(courseId);
      console.log("Course deletion result:", deleteResult);

      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json({ success: true, courseId });
    } catch (err) {
      console.error("Error deleting course:", err);
      res.status(500).json({ error: err.message });
    }
  });
}
