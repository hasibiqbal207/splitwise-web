import express from "express";

import authenticationRoutes from "./authentication.route.js";
import userRoutes from "./user.route.js";
import groupRoutes from "./group.route.js";
import expenseRoutes from "./expense.route.js";

const router = express.Router();

router.use("/auth", authenticationRoutes);
router.use("/user", userRoutes);
router.use("/group", groupRoutes);
router.use("/expense", expenseRoutes);

export default router;
