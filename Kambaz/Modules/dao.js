// Kambaz/Modules/dao.js
import { v4 as uuidv4 } from "uuid";
import CourseModel from "../Courses/model.js";

export default function ModulesDao() {
  // Get modules array for a specific course
  async function findModulesForCourse(courseId) {
    const course = await CourseModel.findById(courseId).exec();
    if (!course) return [];
    return course.modules || [];
  }

  // Create a module inside a course (embedded)
  async function createModule(courseId, moduleData) {
    const course = await CourseModel.findById(courseId).exec();
    if (!course) throw new Error("Course not found");

    const newModule = {
      _id: moduleData._id || uuidv4(),
      name: moduleData.name || "Untitled Module",
      description: moduleData.description || "",
      lessons: moduleData.lessons || [],
    };

    course.modules.push(newModule);
    await course.save();
    return newModule;
  }

  // Update a single embedded module (returns updated subdoc)
  async function updateModule(courseId, moduleId, moduleUpdates) {
    const course = await CourseModel.findById(courseId).exec();
    if (!course) throw new Error("Course not found");

    const mod =
      course.modules.id(moduleId) ||
      course.modules.find((m) => m._id === moduleId);
    if (!mod) throw new Error("Module not found");

    // assign allowed fields
    if (moduleUpdates.name !== undefined) mod.name = moduleUpdates.name;
    if (moduleUpdates.description !== undefined)
      mod.description = moduleUpdates.description;
    if (moduleUpdates.lessons !== undefined)
      mod.lessons = moduleUpdates.lessons;

    await course.save();

    // Return the fresh subdoc (convert to plain object)
    return course.modules.find((m) => m._id === moduleId);
  }

  // Delete a module from a course (returns deletion result)
  async function deleteModule(courseId, moduleId) {
    const course = await CourseModel.findById(courseId).exec();
    if (!course) throw new Error("Course not found");

    // Remove subdocument by id
    const before = course.modules.length;
    course.modules = course.modules.filter((m) => m._id !== moduleId);
    const after = course.modules.length;

    await course.save();
    return { deletedCount: before - after };
  }

  return {
    findModulesForCourse,
    createModule,
    updateModule,
    deleteModule,
  };
}
