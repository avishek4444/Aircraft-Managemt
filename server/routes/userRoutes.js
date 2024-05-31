import express from "express";
import {
  createUser,
  deleteUser,
  getAlluser,
  loginUser,
  updateUser,
  getOneUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", createUser);

router.post("/login", loginUser);

router.get("/", getAlluser);

router.get("/:id", getOneUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
