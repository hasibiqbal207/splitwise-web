import express from "express";

import authenticationRoutes from "./authentication.route.js";

const router = express.Router();

router.use("/auth", authenticationRoutes);

export default router;
