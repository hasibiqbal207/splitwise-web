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

router.route("/viewExpense").get(viewExpense);

router.route("/deleteExpense").delete(deleteExpense);

router.route("/user").get(getUserExpenses);

router.route("/user/recentExpenses").get(getRecentUserExpenses);

router.route("/user/dailyExpense").get(userDailyExpense);

router.route("/user/monthlyExpense").get(userMonthlyExpense);

router.route("/user/expenseByCategory").get(userExpenseByCategory);

router.route("/group").get(getGroupExpenses);
 
router.route("/group/dailyExpense").get(groupDailyExpense);

router.route("/group/monthlyExpense").get(groupMonthlyExpense);

router.route("/group/expenseByCategory").get(groupExpenseByCategory);

export default router;
