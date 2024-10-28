import { Request, Response } from "express";
import * as validator from "../utils/validation.js";
import handleAsync from "../utils/handleAsync.js";
import { findUserByEmail } from "../services/authentication.service.js";
import simplifyDebts from "../utils/split.js";

import {
  createGroupinDB,
  findGroupByID,
  updateGroupinDB,
  deleteGroupinDB,
  getUserGroups,
  createSettlement,
  updateGroupSplit,
} from "../services/group.service.js";

interface CustomError extends Error {
  status?: number;
}

type EmailToAmountMap = Record<string, number>;

export const createGroup = handleAsync(async (req: Request, res: Response) => {
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
    const splitAmounts: EmailToAmountMap = {};

    // Iterate over each group member to validate and initialize split amounts
    for (const memberEmail of newGroup.groupMembers) {
      // Validate that the group member exists in the database
      const isMemberValid = await validator.userValidation(memberEmail);
      if (!isMemberValid) {
        const error: CustomError = new Error("Invalid member email");
        error.status = 400;
        throw error;
      }

      // Add member to the splitAmounts object with an initial value of 0
      splitAmounts[memberEmail] = 0;
    }
    console.log(splitAmounts);
    /*
        The splitAmounts object now contains each user's email as the key
        and the split amount (currently 0) as the value.
        We store this splitAmounts object in the newGroup model to be saved to the database.
      */
    newGroup.split = splitAmounts;

    // Validate that the group owner exists in the database
    const isOwnerValid = await validator.userValidation(newGroup.groupOwner);
    if (!isOwnerValid) {
      const error: CustomError = new Error("Invalid owner email");
      error.status = 400;
      throw error;
    }

    // Save the new group to the database
    const createdGroup = await createGroupinDB(newGroup);
    console.log("Group created successfully", createdGroup);

    // Respond with success status and group ID
    res.status(200).json({
      status: "Success",
      message: "Group created successfully",
      groupData: createdGroup,
    });
  }
}, "Failed to create the group.");

export const viewGroup = handleAsync(async (req: Request, res: Response) => {
  const { groupId } = req.body;
  const group = await findGroupByID(groupId);

  if (!group || groupId == null) {
    const error: CustomError = new Error("Invalid Group Id");
    error.status = 400;
    throw error;
  }
  res.status(200).json({
    status: "Success",
    groupData: group,
  });
}, "Failed to fetch group data.");

export const editGroup = handleAsync(async (req: Request, res: Response) => {
  const groupId = req.body.id;
  const group = await findGroupByID(groupId);

  //Validation to check if the group exists
  if (!group || groupId == null) {
    const error: CustomError = new Error("Invalid Group Id");
    error.status = 400;
    throw error;
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
        const error: CustomError = new Error("Invalid member email");
        error.status = 400;
        throw error;
      }

      //Check if a new group member is added to the gorup and missing in the split
      if (!updatedGroup.split.hasOwnProperty(memberEmail)) {
        //adding the missing members to the split and init with value 0
        updatedGroup.split[memberEmail] = 0;
      }
    }

    // Validate that the group owner exists in the database
    const isOwnerValid = await validator.userValidation(
      updatedGroup.groupOwner
    );
    if (!isOwnerValid) {
      const error: CustomError = new Error("Invalid owner email");
      error.status = 400;
      throw error;
    }

    const updatedResponse = await updateGroupinDB(updatedGroup);

    res.status(200).json({
      status: "Success",
      message: "Group updated successfully!",
      groupData: updatedResponse,
    });
  }
}, "Failed to Update Group data.");

export const deleteGroup = handleAsync(async (req: Request, res: Response) => {
  const { groupId } = req.body;
  const group = await findGroupByID(groupId);

  console.log(group)

  if (!group) {
    const error: CustomError = new Error("Invalid Group Id");
    error.status = 400;
    throw error;
  }

  const deleteGroupResponse = await deleteGroupinDB(groupId);
  res.status(200).json({
    status: "Success",
    message: "Group deleted successfully!",
    response: deleteGroupResponse,
  });
}, "Failed to delete the group.");

export const findGroupsbyUser = handleAsync(
  async (req: Request, res: Response) => {
    const email = req.body.email;
    const user = await findUserByEmail(email);

    if (!user) {
      const error: CustomError = new Error("User Id not found !");
      error.status = 400;
      throw error;
    }

    const groups = await getUserGroups(email);

    res.status(200).json({
      status: "Success",
      groups: groups,
    });
  },
  "Failed to fetch all groups where the user is a member."
);

export const makeSettlement = handleAsync(
  async (req: Request, res: Response) => {
    validator.notNull(req.body.groupId);
    validator.notNull(req.body.settleTo);
    validator.notNull(req.body.settleFrom);
    validator.notNull(req.body.settleAmount);
    validator.notNull(req.body.settleDate);

    // Fetch the group by ID
    const group = await findGroupByID(req.body.groupId);
    if (!group) {
      const error: CustomError = new Error("Invalid Group Id");
      error.status = 400;
      throw error;
    }

    // Perform settlement logic
    group.split[req.body.settleFrom] += req.body.settleAmount;
    group.split[req.body.settleTo] -= req.body.settleAmount;

    // Persist the settlement and update the group
    const settlementId = await createSettlement(req.body);
    const updatedResponse = await updateGroupSplit(
      group._id as string,
      group.split
    );

    res.status(200).json({
      message: "Settlement successfully!",
      status: "Success",
      update: updatedResponse,
      response: settlementId,
    });
  },
  "Failed to make settlement."
);

export const groupBalanceSheet = handleAsync(
  async (req: Request, res: Response) => {
    // Fetch the group by ID
    const group = await findGroupByID(req.body.groupId);
    if (!group) {
      const error: CustomError = new Error("Invalid Group Id");
      error.status = 400;
      throw error;
    }

    res.status(200).json({
      status: "Success",
      data: simplifyDebts(group.split),
    });
  },
  "Failed to settle the group."
);
