let todos = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];

export default function WorkingWithObjectsAsynchronously(app) {
  // ✅ GET all todos
  app.get("/lab5/todos", (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === "true";
      const filtered = todos.filter((t) => t.completed === completedBool);
      res.json(filtered);
    } else {
      res.json(todos);
    }
  });

  // ✅ POST: create a new todo
  app.post("/lab5/todos", (req, res) => {
    const { title } = req.body;
    const newTodo = {
      id: new Date().getTime(),
      title: title || "New Task",
      completed: false,
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
  });

  // ✅ PUT: update todo title or completion status
  app.put("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }

    const todo = todos[todoIndex];
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    res.json(todo);
  });

  // ✅ DELETE: remove a todo
  app.delete("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
      return;
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    res.json(deletedTodo);
  });

  // ✅ GET a single todo by ID
  app.get("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
      return;
    }
    res.json(todo);
  });
  app.get("/Lab5/WorkingWithObjectsAsynchronously", (req, res) => {
    console.log("Frontend called the backend!");
    res.json({ message: "Hello from backend" });
  });
}
