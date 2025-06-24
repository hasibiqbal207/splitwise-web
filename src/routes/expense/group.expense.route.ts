import express from "express";

import {
  getGroupExpenses,
  groupDailyExpense,
  groupMonthlyExpense,
  groupExpenseByCategory
} from "../../controllers/expense/groupExpenses.controller.js";

const router = express.Router();

router.route("/").post(getGroupExpenses);
 
router.route("/dailyExpense").post(groupDailyExpense);

router.route("/monthlyExpense").post(groupMonthlyExpense);

router.route("/expenseByCategory").post(groupExpenseByCategory);

export default router;
