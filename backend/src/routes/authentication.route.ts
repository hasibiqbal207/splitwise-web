import express from "express";

import {
  registerUser,
  loginUser,
  updatePassword,
} from "../controllers/authentication.controller.js";
import { validateToken } from "../utils/apiAuthentication.js";

const router = express.Router();

router.route("/registerUser").post(registerUser);

router.route("/loginUser").post(loginUser);

router.route("/updatePassword").post(validateToken, updatePassword);

export default router;