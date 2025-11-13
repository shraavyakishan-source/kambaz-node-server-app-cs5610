import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  // GET /api/courses -> all courses
  const findAllCourses = (req, res) => {
    const courses = dao.findAllCourses();
    res.json(courses);
  };
  app.get("/api/courses", findAllCourses);

  // GET /api/users/:userId/courses -> courses for the specified user (supports "current")
  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session && req.session.currentUser;
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = dao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  // POST /api/users/current/courses -> create a new course and enroll current user in it
  const createCourse = (req, res) => {
    const currentUser = req.session && req.session.currentUser;
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    const courseData = req.body || {};
    // optional: ensure required fields exist (name, description) — validate as you like
    const newCourse = dao.createCourse(courseData);

    // enroll the creating user in the new course
    if (typeof enrollmentsDao.enrollUserInCourse === "function") {
      enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    }

    res.status(201).json(newCourse);
  };
  app.post("/api/users/current/courses", createCourse);

  // DELETE /api/courses/:courseId -> delete course
  const deleteCourse = (req, res) => {
    const { courseId } = req.params;
    const status = dao.deleteCourse(courseId);
    if (status.status === "not_found") {
      res.sendStatus(404);
      return;
    }
    res.json(status);
  };
  app.delete("/api/courses/:courseId", deleteCourse);

  // PUT /api/courses/:courseId -> update course
  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body || {};
    const updated = dao.updateCourse(courseId, courseUpdates);
    if (!updated) {
      res.sendStatus(404);
      return;
    }
    res.json(updated);
  };
  app.put("/api/courses/:courseId", updateCourse);
}
