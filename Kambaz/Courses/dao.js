import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  function findAllCourses() {
    return db.courses || [];
  }

  function findCoursesForEnrolledUser(userId) {
    const { courses = [], enrollments = [] } = db;
    return courses.filter((course) =>
      enrollments.some(
        (enrollment) =>
          enrollment.user === userId && enrollment.course === course._id
      )
    );
  }

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    db.courses = [...(db.courses || []), newCourse];
    return newCourse;
  }

  function deleteCourse(courseId) {
    const courses = db.courses || [];
    const enrollments = db.enrollments || [];

    const index = courses.findIndex((c) => c._id === courseId);
    if (index === -1) {
      return { status: "not_found" };
    }

    // remove course
    db.courses = courses.filter((c) => c._id !== courseId);

    // remove any enrollments referencing this course
    db.enrollments = enrollments.filter((enr) => enr.course !== courseId);

    return { status: "deleted", id: courseId };
  }

  function updateCourse(courseId, courseUpdates) {
    const courses = db.courses || [];
    const course = courses.find((c) => c._id === courseId);
    if (!course) {
      return null;
    }
    Object.assign(course, courseUpdates);
    return course;
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
