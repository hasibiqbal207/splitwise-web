import express from "express";

import { viewUserProfile, updateUserProfile, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/userProfile").get(viewUserProfile)

router.route("/userProfile").put(updateUserProfile)

router.route("/deleteUser").delete(deleteUser)
// router.route("/allUser").get(loginUser)


export default router