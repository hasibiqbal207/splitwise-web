import { Request, Response } from "express";
import * as validator from "../../utils/validation.js";
import { findGroupByID } from "../../services/group.service.js";
import {
  createExpenseinDB,
  getExpenseById,
  deleteExpenseById,
  updateExpense,
} from "../../services/expense.service.js";
import { revertSplit, splitNewExpense } from "../../utils/split.js";
import handleAsync from "../../utils/handleAsync.js";

interface CustomError extends Error {
  status?: number;
}

export const addExpense = handleAsync(async (req: Request, res: Response) => {
  const expenseData = req.body;

  // Find the group by ID
  const group = await findGroupByID(expenseData.groupId);
  if (!group) {
    const error: CustomError = new Error("Invalid Group ID");
    error.status = 400;
    throw error;
  }
  
  // Perform validation on the expense data
  if (
    validator.notNull(expenseData.expenseName) &&
    validator.notNull(expenseData.expenseAmount) &&
    validator.notNull(expenseData.expenseOwner) &&
    validator.notNull(expenseData.expenseMembers) 
    // &&
    // validator.notNull(expenseData.expenseDate)
  ) {
    // Validate the expense owner
    const isOwnerValid = await validator.groupUserValidation(
      expenseData.expenseOwner,
      expenseData.groupId
    );
    if (!isOwnerValid) {
      const error: CustomError = new Error(
        "Please provide a valid group owner"
      );
      error.status = 400;
      throw error;
    }

    // Validate each expense member
    for (const memberEmail of expenseData.expenseMembers) {
      const isMemberValid = await validator.groupUserValidation(
        memberEmail,
        expenseData.groupId
      );
      if (!isMemberValid) {
        const error: CustomError = new Error(
          "Please ensure the members exist in the group"
        );
        error.status = 400;
        throw error;
      }
    }

    // Calculate the expense per member
    expenseData.expensePerMember =
      expenseData.expenseAmount / expenseData.expenseMembers.length;
    expenseData.expenseCurrency = group.groupCurrency;

    // Create a new expense document
    const newExpense = await createExpenseinDB(expenseData);

    // Update the split values in the group
    const splitUpdateResponse = await splitNewExpense(
      expenseData.groupId,
      expenseData.expenseAmount,
      expenseData.expenseOwner,
      expenseData.expenseMembers
    );

    // Respond with success status and new expense ID
    res.status(200).json({
      status: "Success",
      message: "New expense added",
      expenseId: newExpense._id,
      splitUpdateResponse,
    });
  }
}, "Failed to add the expense to the group");

export const editExpense = handleAsync(async (req: Request, res: Response) => {
  const newExpenseData = req.body;

  let previousExpense = await getExpenseById(newExpenseData.id);

  if (
    !previousExpense ||
    newExpenseData.id == null ||
    previousExpense.groupId != newExpenseData.groupId
  ) {
    const error: CustomError = new Error("Invalid Expense Id");
    error.status = 400;
    throw error;
  }

  // Perform validation on the expense data
  if (
    validator.notNull(newExpenseData.expenseName) &&
    validator.notNull(newExpenseData.expenseAmount) &&
    validator.notNull(newExpenseData.expenseOwner) &&
    validator.notNull(newExpenseData.expenseMembers)
  ) {
    // Validate the expense owner
    const isOwnerValid = await validator.groupUserValidation(
      newExpenseData.expenseOwner,
      newExpenseData.groupId
    );
    if (!isOwnerValid) {
      const error: CustomError = new Error(
        "Please provide a valid group owner"
      );
      error.status = 400;
      throw error;
    }

    // Validate each expense member
    for (const memberEmail of newExpenseData.expenseMembers) {
      const isMemberValid = await validator.groupUserValidation(
        memberEmail,
        newExpenseData.groupId
      );
      if (!isMemberValid) {
        const error: CustomError = new Error(
          "Please ensure the members exist in the group"
        );
        error.status = 400;
        throw error;
      }
    }

    const updatedExpenseData = await updateExpense(newExpenseData);

    //Updating the group split values
    await revertSplit(
      previousExpense.groupId,
      previousExpense.expenseAmount,
      previousExpense.expenseOwner,
      previousExpense.expenseMembers
    );
    await splitNewExpense(
      newExpenseData.groupId,
      newExpenseData.expenseAmount,
      newExpenseData.expenseOwner,
      newExpenseData.expenseMembers
    );

    // Respond with success status and new expense ID
    res.status(200).json({
      status: "Success",
      message: "Expense Edited",
      response: updatedExpenseData,
    });
  }
}, "Failed to edit the expense");

export const viewExpense = handleAsync(async (req: Request, res: Response) => {
  let expense = await getExpenseById(req.body.id);

  if (!expense) {
    const error: CustomError = new Error("No expense present for the Id");
    error.status = 400;
    throw error;
  }
  res.status(200).json({
    status: "Success",
    expense: expense,
  });
}, "Failed to fetch expense");

export const deleteExpense = handleAsync(
  async (req: Request, res: Response) => {
    const expenseId = req.body.id;
    let expense = await getExpenseById(expenseId);

    if (!expense) {
      const error: CustomError = new Error("No expense present for the Id");
      error.status = 400;
      throw error;
    }

    const deleteExpenseResponse = await deleteExpenseById(expenseId);

    //Clearing split value for the deleted expense from group table
    await revertSplit(
      expense.groupId,
      expense.expenseAmount,
      expense.expenseOwner,
      expense.expenseMembers
    );

    res.status(200).json({
      status: "Success",
      message: "Expense is deleted",
      response: deleteExpenseResponse,
    });
  },
  "Failed to delete expense"
);
