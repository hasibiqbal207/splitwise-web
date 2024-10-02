import { Request, Response } from "express";
import handleAsync from "../utils/handleAsync.js";
// import { validateUser } from "../utils/apiAuthentication.js";
import logger from "../../config/logger.config.js";
import * as validator from "../utils/validation.js";
import {
  deleteUserByEmail,
  fetchUserByEmail,
  updateUserData,
  fetchAllUsers,
} from "../services/user.service.js";

interface CustomError extends Error {
  status?: number;
}

export const viewUserProfile = handleAsync(
  async (req: Request, res: Response) => {
    const { email } = req.body;
    logger.error("Checking user: " + email);

    // validateUser(req.user, email); //[Check]

    const user = await fetchUserByEmail(email);

    if (!user) {
      const error: CustomError = new Error("User does not exist!");
      error.status = 400;
      throw error;
    }

    logger.error("User: " + user);
    res.status(200).json({
      status: "Success",
      message: "User fetched successfully",
      user,
    });
  },
  "Failed to create user"
);

export const updateUserProfile = handleAsync(
  async (req: Request, res: Response) => {
    const { firstName, lastName, email } = req.body;

    // validateUser(req.user, email); //[Check]
    const userCheck = await validator.userValidation(email);
    if (!userCheck) {
      const error: CustomError = new Error("User does not exist!");
      error.status = 400;
      throw error;
    }

    // Performing validations
    if (validator.notNull(firstName) && validator.notNull(lastName)) {
      //storing user details in DB
      const updatedResponse = await updateUserData(firstName, lastName, email);
      res.status(200).json({
        status: "Success",
        message: "User update Success",
        response: updatedResponse,
      });
    }
  },
  "Failed to create user"
);

export const deleteUser = handleAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  // validateUser(req.user, email); //[Check]
  const userCheck = await validator.userValidation(email);
  if (!userCheck) {
    const error: CustomError = new Error("User does not exist!");
    error.status = 400;
    throw error;
  }

  const deleteUserResponse = await deleteUserByEmail(email);

  res.status(200).json({
    status: "Success",
    message: "User Account deleted!",
    response: deleteUserResponse,
  });
}, "Failed to create user");

export const getAllUsers = handleAsync(async (req: Request, res: Response) => {
  const users = await fetchAllUsers();

  if (!users) {
    const error: CustomError = new Error("User does not exist!");
    error.status = 400;
    throw error;
  }

  let emailList = [];
  for (const user of users) {
    emailList.push(user.email);
  }

  res.status(200).json({
    status: "Success",
    users: emailList,
  });
}, "Failed to create user");
