import express from "express";

import {
  addExpense,
  editExpense,
  viewExpense,
  deleteExpense,
  getUserExpenses,
  getRecentUserExpenses,
  userDailyExpense,
  userMonthlyExpense,
  userExpenseByCategory,
  getGroupExpenses,
  groupDailyExpense,
  groupMonthlyExpense,
  groupExpenseByCategory
} from "../controllers/expense.controller.js";

const router = express.Router();

router.route("/addExpense").post(addExpense);

router.route("/editExpense").put(editExpense);

router.route("/viewExpense").post(viewExpense);

router.route("/deleteExpense").delete(deleteExpense);

router.route("/user").post(getUserExpenses);

router.route("/user/recentExpenses").post(getRecentUserExpenses);

router.route("/user/dailyExpense").post(userDailyExpense);

router.route("/user/monthlyExpense").post(userMonthlyExpense);

router.route("/user/expenseByCategory").post(userExpenseByCategory);

router.route("/group").post(getGroupExpenses);
 
router.route("/group/dailyExpense").post(groupDailyExpense);

router.route("/group/monthlyExpense").post(groupMonthlyExpense);

router.route("/group/expenseByCategory").post(groupExpenseByCategory);

export default router;
