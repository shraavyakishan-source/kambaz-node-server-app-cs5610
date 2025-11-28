import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao() {
  // FIND ALL COURSES
  const findAllCourses = () => model.find({}, { name: 1, description: 1 });

  // CREATE COURSE
  const createCourse = (course) => {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
  };

  // DELETE COURSE
  const deleteCourse = (courseId) => model.deleteOne({ _id: courseId });

  // UPDATE COURSE
  const updateCourse = (courseId, courseUpdates) =>
    model.findByIdAndUpdate(courseId, courseUpdates, { new: true });

  const findUsersForCourse = async (courseId) => {
    const enrollments = await model.find({ course: courseId }).populate("user"); // returns user objects, not just IDs
    return enrollments.map((e) => e.user);
  };

  return {
    findAllCourses,
    createCourse,
    deleteCourse,
    updateCourse,
    findUsersForCourse,
  };
}
