import apiAuth from "../utils/apiAuthentication.js";
import logger from "../../config/logger.config.js";
import * as validator from "../utils/validation.js";
import { GroupModel } from "../models/index.js";

import {
  createGroupinDB,
  findGroupinDB,
  updateGroupinDB,
  deleteGroupinDB,
  getUserGroups,
} from "../services/group.service.js";

import { findUserByEmail } from "../services/authentication.service.js";

export const createGroup = async (req, res) => {
  try {
    // Create a new group instance from the request body
    const newGroup = req.body;

    // Perform validation on the input
    if (
      validator.notNull(newGroup.groupName) &&
      validator.currencyValidation(newGroup.groupCurrency)
    ) {
      /*
            splitAmounts is used to store the user split value (how much a person owes).
            When the group is created, all members are assigned a split value of 0.
        */
      const splitAmounts = {};

      // Iterate over each group member to validate and initialize split amounts
      for (const memberEmail of newGroup.groupMembers) {
        // Validate that the group member exists in the database
        const isMemberValid = await validator.userValidation(memberEmail);
        if (!isMemberValid) {
          const error = new Error("Invalid member email");
          error.status = 400;
          throw error;
        }

        // Add member to the splitAmounts object with an initial value of 0
        splitAmounts[memberEmail] = 0;
      }

      /*
            The splitAmounts object now contains each user's email as the key
            and the split amount (currently 0) as the value.
            We store this splitAmounts object in the newGroup model to be saved to the database.
          */
      newGroup.split = splitAmounts;

      // Validate that the group owner exists in the database
      const isOwnerValid = await validator.userValidation(newGroup.groupOwner);
      if (!isOwnerValid) {
        const error = new Error("Invalid owner email");
        error.status = 400;
        throw error;
      }

      // Save the new group to the database
      const createdGroup = createGroupinDB(newGroup);

      // Respond with success status and group ID
      res.status(200).json({
        status: "Success",
        message: "Group created successfully",
        groupId: createdGroup, // check
      });
    }
  } catch (err) {
    // Log the error and respond with the appropriate status and message
    logger.error(
      `URL: ${req.originalUrl} | status: ${err.status} | message: ${err.message} ${err.stack}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const viewGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await findGroupinDB(groupId);

    if (!group || groupId == null) {
      const err = new Error("Invalid Group Id");
      err.status = 400;
      throw err;
    }
    res.status(200).json({
      status: "Success",
      group: group,
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

export const editGroup = async (req, res) => {
  try {
    const groupId = req.body.id;
    const group = await findGroupinDB(groupId);

    //Validation to check if the group exists
    if (!group || groupId == null) {
      const err = new Error("Invalid Group Id");
      err.status = 400;
      throw err;
    }

    const updatedGroup = req.body;

    //Passing the existing split to the edit group
    updatedGroup.split = group.split;

    if (
      validator.notNull(updatedGroup.groupName) &&
      validator.currencyValidation(updatedGroup.groupCurrency)
    ) {
      for (const memberEmail of updatedGroup.groupMembers) {
        // Validate that the group member exists in the database
        const isMemberValid = await validator.userValidation(memberEmail);
        if (!isMemberValid) {
          const error = new Error("Invalid member email");
          error.status = 400;
          throw error;
        }

        //Check if a new group member is added to the gorup and missing in the split
        //split[0] is used since json is stored as an array in the DB - ideally there should only be one element in the split array hence we are using the index number
        if (!updatedGroup.split[0].hasOwnProperty(memberEmail)) {
          //adding the missing members to the split and init with value 0
          updatedGroup.split[0][memberEmail] = 0;
        }
      }

      // Validate that the group owner exists in the database
      const isOwnerValid = await validator.userValidation(
        updatedGroup.groupOwner
      );
      if (!isOwnerValid) {
        const error = new Error("Invalid owner email");
        error.status = 400;
        throw error;
      }

      const updatedResponse = updateGroupinDB(updatedGroup);

      res.status(200).json({
        status: "Success",
        message: "Group updated successfully!",
        response: updatedResponse,
      });
    }
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await findGroupinDB(groupId);

    if (!group) {
      const err = new Error("Invalid Group Id");
      err.status = 400;
      throw err;
    }

    const deleteGroupResponse = await deleteGroupinDB(groupId);
    res.status(200).json({
      status: "Success",
      message: "Group deleted successfully!",
      response: deleteGroupResponse,
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

export const findGroupsbyUser = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await findUserByEmail(userEmail);

    if (!user) {
      const err = new Error("User Id not found !");
      err.status = 400;
      throw err;
    }

    const groups = await getUserGroups(userEmail);

    res.status(200).json({
      status: "Success",
      groups: groups,
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

export const splitNewExpense = async (
  groupId,
  expenseAmount,
  expenseOwner,
  expenseMembers
) => {
  try {
    // Find the group by ID
    const group = await findGroupinDB(groupId);

    // Update the group's total expense
    group.groupTotal += expenseAmount;

    // Add the expense amount to the expense owner's balance
    group.split[0][expenseOwner] += expenseAmount;

    // Calculate the expense per member
    const expensePerMember =
      Math.round(
        (expenseAmount / expenseMembers.length + Number.EPSILON) * 100
      ) / 100;

    // Update the split values for each member
    for (const memberEmail of expenseMembers) {
      group.split[0][memberEmail] -= expensePerMember;
    }

    // Check if the group balance is zero; if not, adjust the owner's balance
    let totalBalance = 0;
    for (const balance of Object.entries(group.split[0])) {
      totalBalance += balance;
    }

    group.split[0][expenseOwner] -= totalBalance;
    group.split[0][expenseOwner] =
      Math.round((group.split[0][expenseOwner] + Number.EPSILON) * 100) / 100;

    // Update the group with the new split values
    return await GroupModel.updateOne({ _id: groupId }, group);
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const revertLastSplit = async (
  groupId,
  expenseAmount,
  expenseOwner,
  expenseMembers
) => {
  try {
    // Find the group by ID
    const group = await findGroupinDB(groupId);

    // Update the group's total expense
    group.groupTotal -= expenseAmount;

    // Add the expense amount to the expense owner's balance
    group.split[0][expenseOwner] -= expenseAmount;

    // Calculate the expense per member
    const expensePerMember =
      Math.round(
        (expenseAmount / expenseMembers.length + Number.EPSILON) * 100
      ) / 100;

    // Update the split values for each member
    for (const memberEmail of expenseMembers) {
      group.split[0][memberEmail] += expensePerMember;
    }

    // Check if the group balance is zero; if not, adjust the owner's balance
    let totalBalance = 0;
    for (const balance of Object.entries(group.split[0])) {
      totalBalance += balance;
    }

    group.split[0][expenseOwner] -= totalBalance;
    group.split[0][expenseOwner] =
      Math.round((group.split[0][expenseOwner] + Number.EPSILON) * 100) / 100;

    // Update the group with the new split values
    return await GroupModel.updateOne({ _id: groupId }, group);
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const initiateSettlement = async (req, res) => {};
