import UsersDao from "./dao.js";
export default function UserRoutes(app) {
  const dao = UsersDao();

  // CREATE USER
  const createUser = async (req, res) => {
    const user = await dao.createUser(req.body);
    res.json(user);
  };

  // DELETE USER
  const deleteUser = async (req, res) => {
    const userId = req.params.userId;
    const status = await dao.deleteUser(userId);
    res.json(status);
  };

  // FIND ALL USERS (with optional role filter)
  const findAllUsers = async (req, res) => {
    const { role, name } = req.query;

    if (role) {
      const users = await dao.findUsersByRole(role);
      res.json(users);
      return;
    }

    if (name) {
      const users = await dao.findUsersByPartialName(name);
      res.json(users);
      return;
    }

    const users = await dao.findAllUsers();
    res.json(users);
  };

  // FIND USER BY ID
  const findUserById = async (req, res) => {
    console.log("LOOKING FOR USER ID:", req.params.userId);
    const user = await dao.findUserById(req.params.userId);

    console.log("FOUND:", user);

    if (user) res.json(user);
    else res.status(404).json({ message: "User not found" });
  };

  // UPDATE USER
  const updateUser = async (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;

    await dao.updateUser(userId, userUpdates);

    // Update session if editing current user
    const currentUser = req.session.currentUser;
    if (currentUser && currentUser._id === userId) {
      req.session.currentUser = { ...currentUser, ...userUpdates };
    }

    res.json({ ...currentUser, ...userUpdates });
  };

  app.put("/api/users/:userId", updateUser);

  // SIGNUP
  const signup = async (req, res) => {
    const { username } = req.body;

    const existingUser = await dao.findUserByUsername(username);
    if (existingUser) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }

    const currentUser = await dao.createUser(req.body);
    req.session.currentUser = currentUser;
    res.json(currentUser);
  };
  app.post("/api/users/signup", signup);

  // SIGNIN
  const signin = async (req, res) => {
    const { username, password } = req.body;

    console.log("Signin attempt:", { username, password });

    const currentUser = await dao.findUserByCredentials(username, password);
    console.log("Found user:", currentUser);

    const allUsers = await dao.findAllUsers();
    console.log("All users in DB:", allUsers);

    if (currentUser) {
      req.session.currentUser = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  };
  app.post("/api/users/signin", signin);

  // SIGNOUT
  const signout = async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Signout failed" });
        return;
      }
      res.sendStatus(200);
    });
  };
  app.post("/api/users/signout", signout);

  // PROFILE
  const profile = async (req, res) => {
    const currentUser = req.session.currentUser;
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }
    res.json(currentUser);
  };
  app.post("/api/users/profile", profile);

  // GENERIC ROUTES
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.delete("/api/users/:userId", deleteUser);
}
