import express from "express";

import {
  getUserExpenses,
  getRecentUserExpenses,
  userDailyExpense,
  userMonthlyExpense,
  userExpenseByCategory,
} from "../../controllers/expense/userExpenses.controller.js";

const router = express.Router();

router.route("/").post(getUserExpenses);

router.route("/recentExpenses").post(getRecentUserExpenses);

router.route("/dailyExpense").post(userDailyExpense);

router.route("/monthlyExpense").post(userMonthlyExpense);

router.route("/expenseByCategory").post(userExpenseByCategory);

export default router;
