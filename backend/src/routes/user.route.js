import express from "express";

import { viewUserProfile, updateUserProfile, deleteUser, getAllUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/userProfile").post(viewUserProfile)

router.route("/userProfile").put(updateUserProfile)

router.route("/deleteUser").delete(deleteUser)

router.route("/users").get(getAllUsers)

export default router