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
  app.get("/api/users/:userId/courses", async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session.currentUser;
      if (!currentUser) return res.sendStatus(401);
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  });

  // ENROLL USER IN COURSE
  app.post("/api/users/:uid/courses/:cid", async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session.currentUser;
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  });

  // UNENROLL USER FROM COURSE
  app.delete("/api/users/:uid/courses/:cid", async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session.currentUser;
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  });

  // CREATE COURSE + AUTO ENROLL CREATOR
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
    const updatedCourse = await dao.updateCourse(req.params.courseId, req.body);
    res.json(updatedCourse);
  });

  // DELETE COURSE + REMOVE ALL ENROLLMENTS
  app.delete("/api/courses/:courseId", async (req, res) => {
    try {
      const { courseId } = req.params;

      await enrollmentsDao.unenrollAllUsersFromCourse(courseId);

      const deleteResult = await dao.deleteCourse(courseId);

      if (deleteResult.deletedCount === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET USERS ENROLLED IN A COURSE
  app.get("/api/courses/:cid/users", async (req, res) => {
    try {
      const { cid } = req.params;
      const users = await enrollmentsDao.findUsersForCourse(cid);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users for course:", error);
      res.status(500).send("Error fetching users for course");
    }
  });
}
