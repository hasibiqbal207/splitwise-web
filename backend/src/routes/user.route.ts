import express from "express";

import {
  viewUserProfile,
  updateUserProfile,
  deleteUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { validateToken } from "../utils/apiAuthentication.js";

const router = express.Router();

router.route("/userProfile").post(validateToken, viewUserProfile);

router.route("/updateUser").put(validateToken, updateUserProfile);

router.route("/deleteUser").delete(validateToken, deleteUser);

router.route("/users").get(validateToken, getAllUsers);

export default router;
