import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function UsersDao() {
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    return model.create(newUser);
  };

  const findAllUsers = () => model.find();

  //const findUserById = (userId) => model.findOne({ _id: userId });
  const findUserById = (userId) => model.findById(userId);

  const findUserByUsername = (username) => model.findOne({ username });

  const findUserByCredentials = (username, password) =>
    model.findOne({ username, password });

  const findUsersByRole = (role) => model.find({ role });

  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };

  const updateUser = (userId, user) =>
    model.updateOne({ _id: userId }, { $set: user });

  //const deleteUser = (userId) => model.deleteOne({ _id: userId });
  const deleteUser = (userId) => model.findByIdAndDelete(userId);

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    findUsersByRole,
    findUsersByPartialName,
    updateUser,
    deleteUser,
  };
}
