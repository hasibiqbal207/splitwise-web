import express from "express";

import { registerUser, loginUser } from "../controllers/authentication.controller.js";

const router = express.Router();

router.route("/registerUser").post(registerUser)
router.route("/loginUser").get(loginUser)

export default router