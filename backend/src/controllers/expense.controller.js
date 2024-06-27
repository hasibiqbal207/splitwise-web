import * as validator from "../utils/validation.js";
import logger from "../../config/logger.config.js";
import {findGroupinDB} from "../services/group.service.js";
import {createExpenseinDB} from "../services/expense.service.js";

export const addExpense = async (req, res) => {
  try {
    const expenseData = req.body;

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
      validator.notNull(expenseData.expenseMembers) &&
      validator.notNull(expenseData.expenseDate)
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
      const splitUpdateResponse = await groupDAO.addSplit(
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

export const editExpense = async (req, res) => {};

export const viewExpense = async (req, res) => {};

export const deleteExpense = async (req, res) => {};
