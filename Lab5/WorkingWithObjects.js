const assignment = {
  id: 1,
  title: "NodeJS Assignment",
  description: "Create a NodeJS server with ExpressJS",
  due: "2021-10-10",
  completed: false,
  score: 0,
};

const module = {
  id: "M101",
  name: "Web Development",
  description: "Learn full-stack web development with React and NodeJS",
  course: "CS5610",
};

export default function WorkingWithObjects(app) {
  // Assignment routes
  app.get("/lab5/assignment", (req, res) => res.json(assignment));
  app.get("/lab5/assignment/title", (req, res) => res.send(assignment.title));
  app.get("/lab5/assignment/title/:newTitle", (req, res) => {
    assignment.title = req.params.newTitle;
    res.json(assignment);
  });
  app.get("/lab5/assignment/score/:newScore", (req, res) => {
    assignment.score = parseInt(req.params.newScore);
    res.json(assignment);
  });
  app.get("/lab5/assignment/completed/:newCompleted", (req, res) => {
    assignment.completed = req.params.newCompleted === "true";
    res.json(assignment);
  });

  // Module routes
  app.get("/lab5/module", (req, res) => res.json(module));
  app.get("/lab5/module/name", (req, res) => res.send(module.name));
  app.get("/lab5/module/name/:newName", (req, res) => {
    module.name = req.params.newName;
    res.json(module);
  });
  app.get("/lab5/module/description/:newDescription", (req, res) => {
    module.description = req.params.newDescription;
    res.json(module);
  });
}
