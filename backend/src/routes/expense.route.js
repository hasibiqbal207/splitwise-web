import express from "express";

import {
  addExpense,
  editExpense,
  viewExpense,
  deleteExpense,
  userDailyExpense,
  userMonthlyExpense,
  groupDailyExpense,
  groupMonthlyExpense
} from "../controllers/expense.controller.js";

const router = express.Router();

router.route("/addExpense").post(addExpense);

router.route("/editExpense").put(editExpense);

router.route("/viewExpense").get(viewExpense);

router.route("/deleteExpense").delete(deleteExpense);

router.route("/user/dailyExpense").get(userDailyExpense);

router.route("/user/monthlyExpense").get(userMonthlyExpense);

router.route("/group/dailyExpense").get(groupDailyExpense);

router.route("/group/monthlyExpense").get(groupMonthlyExpense);

export default router;
