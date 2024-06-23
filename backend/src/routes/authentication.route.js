import express from "express";

import { registerUser } from "../controllers/authentication.controller.js";

const router = express.Router();

router.route("/registerUser").post(registerUser)
router.route("/login").post()

export default router