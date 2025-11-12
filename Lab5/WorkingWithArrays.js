let todos = [
  { id: 1, title: "Task 1", completed: false },
  { id: 2, title: "Task 2", completed: true },
  { id: 3, title: "Task 3", completed: false },
  { id: 4, title: "Task 4", completed: true },
];

export default function WorkingWithArrays(app) {
  // ✅ Create a new todo
  const createNewTodo = (req, res) => {
    const newTodo = {
      id: new Date().getTime(),
      title: "New Task",
      completed: false,
    };
    todos.push(newTodo);
    res.json(todos); // or res.json(newTodo)
  };

  // ✅ Get all todos (with optional completed filter)
  const getTodos = (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === "true";
      const filtered = todos.filter((t) => t.completed === completedBool);
      return res.json(filtered);
    }
    res.json(todos);
  };

  // ✅ Get todo by ID
  const getTodoById = (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  };

  // ✅ Delete a todo
  const removeTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1)
      return res.status(404).json({ message: "Todo not found" });
    const deleted = todos.splice(todoIndex, 1)[0];
    res.json(deleted);
  };

  // ✅ Update todo title
  const updateTodoTitle = (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    todo.title = title;
    res.json(todo);
  };

  // --- Route setup ---

  // 1️⃣ Create first, before /:id
  app.get("/lab5/todos/create", createNewTodo);

  // 2️⃣ Delete and update routes
  app.get("/lab5/todos/:id/delete", removeTodo);
  app.get("/lab5/todos/:id/title/:title", updateTodoTitle);

  // 3️⃣ Get by ID
  app.get("/lab5/todos/:id", getTodoById);

  // 4️⃣ Get all (with optional completed filter)
  app.get("/lab5/todos", getTodos);
}
