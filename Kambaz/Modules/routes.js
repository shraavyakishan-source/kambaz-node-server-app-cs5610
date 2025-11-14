import ModulesDao from "../Modules/dao.js";

export default function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);

  // ✅ Find all modules for a specific course
  const findModulesForCourse = (req, res) => {
    const { courseId } = req.params;
    const modules = dao.findModulesForCourse(courseId);
    res.json(modules);
  };

  // ✅ Create a new module for a specific course
  const createModuleForCourse = (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = dao.createModule(module);
    res.json(newModule);
  };

  // ✅ Register the routes
  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
}
