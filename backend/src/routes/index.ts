import express from "express";
import { validateToken } from "../utils/apiAuthentication.js";

import authenticationRoutes from "./authentication.route.js";
import userRoutes from "./user.route.js";
import groupRoutes from "./group.route.js";
import expenseRoutes from "./expense/expense.route.js";

const router = express.Router();

router.use("/auth", authenticationRoutes);
router.use("/user", userRoutes);
router.use("/group", validateToken, groupRoutes);
router.use("/expense", validateToken, expenseRoutes);

export default router;
