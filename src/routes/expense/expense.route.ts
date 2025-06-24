import express from "express";

import {
  addExpense,
  editExpense,
  viewExpense,
  deleteExpense,
} from "../../controllers/expense/expenseOperations.controller.js";

import userExpenseRouter from "./user.expense.route.js";
import groupExpenseRouter from "./group.expense.route.js";

const router = express.Router();

router.route("/addExpense").post(addExpense);

router.route("/editExpense").put(editExpense);

router.route("/viewExpense").post(viewExpense);

router.route("/deleteExpense").delete(deleteExpense);

router.use("/user", userExpenseRouter);

router.use("/group", groupExpenseRouter);

export default router;
