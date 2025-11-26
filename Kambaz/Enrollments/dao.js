import model from "./model.js";

export default function EnrollmentsDao(db) {
  // Get all courses a user is enrolled in
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }

  // Get all users enrolled in a course
  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  }

  // Enroll a user in a course (avoids duplicates)
  async function enrollUserInCourse(userId, courseId) {
    const existing = await model.findOne({ user: userId, course: courseId });
    if (existing) return existing;

    return model.create({
      user: userId,
      course: courseId,
      _id: `${userId}-${courseId}`, // optional custom ID
    });
  }

  // Unenroll a user from a course
  function unenrollUserFromCourse(userId, courseId) {
    return model.deleteOne({ user: userId, course: courseId });
  }
  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
  };
}
