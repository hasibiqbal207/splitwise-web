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

export const getUserExpenses = handleAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const expenses = await getExpensesByUser(email);

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
  "Failed to fetch all the expense of the user."
);

export const userDailyExpense = handleAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const expenses = await getDailyExpense(email);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  },
  "Failed to fetch daily expense of the user."
);

export const userMonthlyExpense = handleAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const expenses = await getMonthlyExpense(email);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  },
  "Failed to fetch monthly expense of the user."
);

export const getRecentUserExpenses = handleAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const expenses = await getRecentExpensesByUser(email);
    res.status(200).json({
      status: "Success",
      expenses: expenses,
    });
  },
  "Failed to fetch last 5 expenses of the user."
);



export const userExpenseByCategory = handleAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const expenses = await getUserExpenseByCategory(email);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  },
  "Failed to fetch expense of the user by category."
);
