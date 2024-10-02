import { Request, Response } from "express";

import {
  getGroupExpensesById,
  getGroupDailyExpense,
  getGroupMonthlyExpense,
  getGroupExpenseByCategory,
} from "../../services/expense.service.js";

import handleAsync from "../../utils/handleAsync.js";

/**
 * Get daily expenses for a group
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {string} req.body.groupId - group ID
 * @returns {Promise<void>}
 */

export const groupDailyExpense = handleAsync(
  async (req: Request, res: Response) => {
    const { groupId } = req.body;
    const expenses = await getGroupDailyExpense(groupId);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  },
  "Failed to create user"
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
  "Failed to create user"
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
  "Failed to create user"
);

export const getGroupExpenses = handleAsync(
  async (req: Request, res: Response) => {
    const { groupId } = req.body;
    const expenses = await getGroupExpensesById(groupId);

    // if (expenses.length == 0) {
    //   const err = new Error("No expense present for the group");
    //   err.status = 400;
    //   throw err;
    // }

    let totalAmount = 0;
    for (const expense of expenses) {
      totalAmount += expense["expenseAmount"];
    }

    res.status(200).json({
      status: "Success",
      expenses: expenses,
      total: totalAmount,
    });
  },
  "Failed to create user"
);
