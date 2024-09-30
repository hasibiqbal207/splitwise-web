import express from "express";

import { registerUser, loginUser, updatePassword } from "../controllers/authentication.controller.js";
import { validateToken } from "../utils/apiAuthentication.js";


const router = express.Router();

/**
 * @openapi
 * /registerUser:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.route("/registerUser").post(registerUser)

/**
 * @swagger
 * /loginUser:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.route("/loginUser").post(loginUser)

router.route("/updatePassword").post(validateToken, updatePassword)
// router.route("/resetPassword").post(resetPassword)

// router.route("/logout").post(logout)

// // Refresh authentication token
// router.route("/refreshToken").post(refreshToken)

export default router