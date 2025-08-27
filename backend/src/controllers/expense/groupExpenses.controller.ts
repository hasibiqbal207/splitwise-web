import { Request, Response } from "express";

import {
  getGroupExpensesById,
  getGroupDailyExpense,
  getGroupMonthlyExpense,
  getGroupExpenseByCategory,
} from "../../services/expense.service.js";

import handleAsync from "../../utils/handleAsync.js";

interface CustomError extends Error {
  status?: number;
}

export const getGroupExpenses = handleAsync(
  async (req: Request, res: Response) => {
    const { groupId } = req.body;
    const expenses = await getGroupExpensesById(groupId);

    if (expenses.length == 0) {
      const err: CustomError = new Error("No expense present for the group");
      err.status = 400;
      throw err;
    }

    let totalAmount = 0;
    for (const expense of expenses) {
      totalAmount += expense["expenseAmount"];
    }

    res.status(200).json({
      status: "Success",
      total: totalAmount,
      expenses: expenses,
    });
  },
  "Failed to fetch all the expenses of the group."
);

export const groupDailyExpense = handleAsync(
  async (req: Request, res: Response) => {
    const { groupId } = req.body;
    const expenses = await getGroupDailyExpense(groupId);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  },
  "Failed to fetch daily expenses of the group."
);

export const groupMonthlyExpense = handleAsync(
  async (req: Request, res: Response) => {
    const { groupId } = req.body;
    const expenses = await getGroupMonthlyExpense(groupId);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  },
  "Failed to fetch monthly expenses of the group."
);

export const groupExpenseByCategory = handleAsync(
  async (req: Request, res: Response) => {
    const { groupId } = req.body;
    const expenses = await getGroupExpenseByCategory(groupId);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  },
  "Failed to fetch all the expenses of the group by category."
);

