import { ExpenseModel } from "../models/index.js";

export const createExpenseinDB = async (expenseData) => {
  return await ExpenseModel.create(expenseData);
};
