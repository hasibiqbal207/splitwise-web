import apiAuth from "../utils/apiAuthentication.js";
import logger from "../../config/logger.config.js";
import * as validator from "../utils/validation.js";

import { createGroupinDB, findGroupinDB } from "../services/group.service.js";

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
        const { groupId } = req.body
        const group = await findGroupinDB(groupId)

        if (!group || groupId == null) {
            const err = new Error('Invalid Group Id')
            err.status = 400
            throw err
        }
        res.status(200).json({
            status: "Success",
            group: group,
        })
    } catch(err) {
        logger.error(`URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`)
        res.status(err.status || 500).json({
            message: err.message
        })
    }
};

export const editGroup = async (req, res) => {};

export const deleteGroup = async (req, res) => {};

export const findGroup = async (req, res) => {};
