import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const creatoken = (_id) => {
  return jwt.sign({ _id }, process.env.SECURITY_KEY, { expiresIn: "3d" });
};

const createUser = async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    const user = await userModel.createUser(email, password, name, role);
    const token = creatoken(user._id);
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.login(email, password);
    const id = user._id
    const token = creatoken(user._id);
    const role = user.role;
    const status = user.status;
    const name = user.name;

    res.status(200).json({id, token, email, role, status, name });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAlluser = async (req, res) => {
  const users = await userModel.find({}).sort({ createtAt: -1 });
  res.status(200).json(users);
};

const getOneUser = async (req, res) => {
  const { id } = req.params
  const user = await userModel.findOne({ _id: id});
  res.status(200).json(user);
}

const updateUser = async (req, res) => {
  const data = req?.body;

  const { id } = req.params;

  try {
    // const salt = await bcrypt.genSalt(10);
    // const hash = await bcrypt.hash(data?.password, salt);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "cannot update user" });
    }

    const updatedUser = await userModel.updateOne(
      { _id: id },
      { $set: { ...data } }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "no user found to update" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "cannot delete user" });
    }

    const deletedUser = await userModel.findOneAndDelete({ _id: id });

    if (!deletedUser) {
      return res.status(400).json({ message: "no such user found to delete" });
    }
     res.status(200).json(deletedUser);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { createUser, loginUser, getAlluser, updateUser, deleteUser, getOneUser };
