import express from "express";

import { registerUser, loginUser } from "../controllers/authentication.controller.js";

const router = express.Router();

router.route("/deleteUser").delete(registerUser)
router.route("/userProfile").get(loginUser)
router.route("/userProfile").put(loginUser)
// router.route("/allUser").get(loginUser)


export default router