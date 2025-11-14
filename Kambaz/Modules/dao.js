import { v4 as uuidv4 } from "uuid";

export default function ModuleDao(db) {
  // ✅ Find all modules for a specific course
  function findModulesForCourse(courseId) {
    return db.modules.filter((module) => module.course === courseId);
  }

  // ✅ Create a new module
  function createModule(module) {
    const newModule = { ...module, _id: uuidv4() };
    db.modules = [...db.modules, newModule];
    return newModule;
  }

  return {
    findModulesForCourse,
    createModule,
  };
}
