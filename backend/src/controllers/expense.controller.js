import * as validator from "../utils/validation.js";
import logger from "../../config/logger.config.js";
import { findGroupinDB } from "../services/group.service.js";
import {
  createExpenseinDB,
  getExpenseById,
  deleteExpenseById,
  updateExpense,
  getDailyExpense,
  getMonthlyExpense
} from "../services/expense.service.js";
import { revertSplit, splitNewExpense } from "./group.controller.js";

export const addExpense = async (req, res) => {
  try {
    const expenseData = req.body;
    logger.info(expenseData);
    // Find the group by ID
    const group = await findGroupinDB(expenseData.groupId);
    if (!group) {
      const error = new Error("Invalid Group ID");
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
        const error = new Error("Please provide a valid group owner");
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
          const error = new Error(
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
  } catch (err) {
    // Log the error and respond with the appropriate status and message
    logger.error(
      `URL: ${req.originalUrl} | status: ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const editExpense = async (req, res) => {
  try {
    const newExpenseData = req.body;

    let previousExpense = await getExpenseById(newExpenseData.id);

    if (
      !previousExpense ||
      newExpenseData.id == null ||
      previousExpense.groupId != newExpenseData.groupId
    ) {
      const err = new Error("Invalid Expense Id");
      err.status = 400;
      throw err;
    }

    // Perform validation on the expense data
    if (
      validator.notNull(newExpenseData.expenseName) &&
      validator.notNull(newExpenseData.expenseAmount) &&
      validator.notNull(newExpenseData.expenseOwner) &&
      validator.notNull(newExpenseData.expenseMembers) 
      // validator.notNull(newExpenseData.expenseDate)
    ) {
      // Validate the expense owner
      const isOwnerValid = await validator.groupUserValidation(
        newExpenseData.expenseOwner,
        newExpenseData.groupId
      );
      if (!isOwnerValid) {
        const error = new Error("Please provide a valid group owner");
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
          const error = new Error(
            "Please ensure the members exist in the group"
          );
          error.status = 400;
          throw error;
        }
      }

      console.log("Check mark", newExpenseData)
      
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
  } catch (err) {
    // Log the error and respond with the appropriate status and message
    logger.error(
      `URL: ${req.originalUrl} | status: ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const viewExpense = async (req, res) => {
  try {
    let expense = await getExpenseById(req.body.id);

    if (!expense) {
      const err = new Error("No expense present for the Id");
      err.status = 400;
      throw err;
    }
    res.status(200).json({
      status: "Success",
      expense: expense,
    });
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.body.id;
    let expense = await getExpenseById(expenseId);

    if (!expense) {
      const err = new Error("No expense present for the Id");
      err.status = 400;
      throw err;
    }

    const deleteExpenseResponse = deleteExpenseById(expenseId);

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
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const userDailyExpense = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const expenses = await getDailyExpense(userEmail);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const userMonthlyExpense = async (req, res) => {
  try {
    const { userEmail } = req.body;
    
    const expenses = await getMonthlyExpense(userEmail);
    res.status(200).json({
      status: "Success",
      responseData: expenses,
    });
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const groupDailyExpense = async (req, res) => {
  try {
    const { groupId } = req.body;
    const expenses = await getGroupDailyExpense(groupId);
    res.status(200).json({
      status: "Success",
      expenses: expenses,
    });
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const groupMonthlyExpense = async (req, res) => {
  try {
    const { groupId } = req.body;
    const expenses = await getGroupMonthlyExpense(groupId);
    res.status(200).json({
      status: "Success",
      expenses: expenses,
    });
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};