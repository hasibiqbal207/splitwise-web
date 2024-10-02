import { Request, Response } from "express";
import {
  getExpensesByUser,
  getDailyExpense,
  getMonthlyExpense,
  getUserExpenseByCategory,
  getRecentExpensesByUser,
} from "../../services/expense.service.js";
import handleAsync from "../../utils/handleAsync.js";

interface CustomError extends Error {
  status?: number;
}

export const userDailyExpense = handleAsync(
  async (req: Request, res: Response) => {
    const { userEmail } = req.body;
    const expenses = await getDailyExpense(userEmail);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  },
  "Failed to create user"
);

export const userMonthlyExpense = handleAsync(
  async (req: Request, res: Response) => {
    const { userEmail } = req.body;

    const expenses = await getMonthlyExpense(userEmail);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  },
  "Failed to create user"
);

export const getRecentUserExpenses = handleAsync(
  async (req: Request, res: Response) => {
    const { userEmail } = req.body;
    const expenses = await getRecentExpensesByUser(userEmail);
    res.status(200).json({
      status: "Success",
      expenses: expenses,
    });
  },
  "Failed to create user"
);

export const getUserExpenses = handleAsync(
  async (req: Request, res: Response) => {
    const { userEmail } = req.body;
    const expenses = await getExpensesByUser(userEmail);

    if (expenses.length == 0) {
      const error: CustomError = new Error("No expense present for the group");
      error.status = 400;
      throw error;
    }

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

export const userExpenseByCategory = handleAsync(
  async (req: Request, res: Response) => {
    const { userEmail } = req.body;
    const expenses = await getUserExpenseByCategory(userEmail);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  },
  "Failed to create user"
);
