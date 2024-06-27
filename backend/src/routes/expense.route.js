import express from "express";

import {addExpense, editExpense, viewExpense, deleteExpense } from "../controllers/expense.controller.js";

const router = express.Router();

router.route("/addExpense").post(addExpense)

router.route("/editExpense").put(editExpense)

router.route("/viewExpense").get(viewExpense)

router.route("/deleteExpense").delete(deleteExpense)


export default router