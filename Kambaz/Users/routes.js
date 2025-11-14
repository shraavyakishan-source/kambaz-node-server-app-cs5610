import UsersDao from "./dao.js";

export default function UserRoutes(app, db) {
  const dao = UsersDao(db);

  // Create user (generic, not used for signup)
  const createUser = (req, res) => {
    const newUser = dao.createUser(req.body);
    res.json(newUser);
  };

  // Delete user by ID
  const deleteUser = (req, res) => {
    const userId = req.params.userId;
    const deleted = dao.deleteUser(userId);
    if (deleted) res.sendStatus(200);
    else res.status(404).json({ message: "User not found" });
  };

  // Get all users
  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };

  // Get user by ID
  const findUserById = (req, res) => {
    const userId = req.params.userId;
    const user = dao.findUserById(userId);
    if (user) res.json(user);
    else res.status(404).json({ message: "User not found" });
  };

  // Update user by ID
  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;

    const updated = dao.updateUser(userId, userUpdates);
    if (updated) {
      req.session.currentUser = dao.findUserById(userId);
      res.json(req.session.currentUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  };
  app.put("/api/users/:userId", updateUser);

  // Signup route
  const signup = (req, res) => {
    const { username } = req.body;
    const existingUser = dao.findUserByUsername(username);
    if (existingUser) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }

    const newUser = dao.createUser(req.body);
    req.session.currentUser = newUser; // store session
    res.json(newUser);
  };
  app.post("/api/users/signup", signup);

  // Signin route
  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);

    if (currentUser) {
      req.session.currentUser = currentUser; // store session
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  };
  app.post("/api/users/signin", signin);

  // Signout route
  const signout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Signout failed", err);
        res.status(500).json({ message: "Signout failed" });
      } else {
        res.sendStatus(200);
      }
    });
  };
  app.post("/api/users/signout", signout);

  // Profile route
  const profile = (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  app.post("/api/users/profile", profile);

  // Optional: generic user routes
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.delete("/api/users/:userId", deleteUser);

  // ---------- TEMP DEBUG ROUTES ----------
  app.get("/debug/users", (req, res) => res.send("Users route loaded!"));
  app.get("/debug/signup", (req, res) =>
    res.send("Signup route active (POST expected)")
  );
  app.get("/debug/signin", (req, res) =>
    res.send("Signin route active (POST expected)")
  );
  app.get("/debug/profile", (req, res) =>
    res.send("Profile route active (POST expected)")
  );
  app.get("/debug/signout", (req, res) =>
    res.send("Signout route active (POST expected)")
  );
}
