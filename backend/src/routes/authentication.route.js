import express from "express";

import { registerUser, loginUser, updatePassword } from "../controllers/authentication.controller.js";

const router = express.Router();

router.route("/registerUser").post(registerUser)
router.route("/loginUser").post(loginUser)

router.route("/updatePassword").post(updatePassword)
// router.route("/resetPassword").post(resetPassword)

// router.route("/logout").post(logout)

// // Refresh authentication token
// router.route("/refreshToken").post(refreshToken)

export default router