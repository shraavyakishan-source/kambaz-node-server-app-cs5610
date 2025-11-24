// Kambaz/Modules/routes.js
import ModulesDao from "../Modules/dao.js";

export default function ModulesRoutes(app, db) {
  const dao = ModulesDao();

  // GET modules for a course
  const findModulesForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const modules = await dao.findModulesForCourse(courseId);
      res.json(modules);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

  // POST create module for course
  const createModuleForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const moduleData = req.body;
      const newModule = await dao.createModule(courseId, moduleData);
      res.status(201).json(newModule);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

  // PUT update a module in a course
  const updateModuleForCourse = async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const updates = req.body;
      const updated = await dao.updateModule(courseId, moduleId, updates);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

  // DELETE module in course
  const deleteModuleForCourse = async (req, res) => {
    try {
      const { courseId, moduleId } = req.params;
      const result = await dao.deleteModule(courseId, moduleId);
      res.json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.put("/api/courses/:courseId/modules/:moduleId", updateModuleForCourse);
  app.delete("/api/courses/:courseId/modules/:moduleId", deleteModuleForCourse);
}
