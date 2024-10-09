import { Request, Response } from "express";
import handleAsync from "../utils/handleAsync.js";
import { AuthRequest, validateUser } from "../utils/apiAuthentication.js";
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
  async (req: AuthRequest, res: Response) => {
    const { email } = req.body;

    // Ensure user is authenticated and is the same user as the requested email
    if (!req.user) {
      const err: CustomError = new Error("User not authenticated");
      err.status = 401;
      throw err;
    }

    validateUser(req.user, email);

    const user = await fetchUserByEmail(email);

    if (!user) {
      const error: CustomError = new Error("User does not exist!");
      error.status = 400;
      throw error;
    }

    res.status(200).json({
      status: "Success",
      message: "User fetched successfully",
      user,
    });
  },
  "Failed to fetch user"
);

export const updateUserProfile = handleAsync(
  async (req: AuthRequest, res: Response) => {
    const { firstName, lastName, email } = req.body;

    // Ensure user is authenticated and is the same user as the requested email
    if (!req.user) {
      const err: CustomError = new Error("User not authenticated");
      err.status = 401;
      throw err;
    }

    validateUser(req.user, email);

    const userCheck = await validator.userValidation(email);
    if (!userCheck) {
      const error: CustomError = new Error("User does not exist!");
      error.status = 400;
      throw error;
    }

    // Performing validations
    if (validator.notNull(firstName) && validator.notNull(lastName)) {
      const updatedResponse = await updateUserData(firstName, lastName, email);
      res.status(200).json({
        status: "Success",
        message: "User updated Successfully",
        response: updatedResponse,
      });
    }
  },
  "Failed to update user name"
);

export const deleteUser = handleAsync(
  async (req: AuthRequest, res: Response) => {
    const { email } = req.body;

    // Ensure user is authenticated and is the same user as the requested email
    if (!req.user) {
      const err: CustomError = new Error("User not authenticated");
      err.status = 401;
      throw err;
    }

    validateUser(req.user, email);

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
  },
  "Failed to delete user"
);

export const getAllUsers = handleAsync(async (req: Request, res: Response) => {
  const users = await fetchAllUsers();

  if (!users) {
    const error: CustomError = new Error("User does not exist!");
    error.status = 400;
    throw error;
  }

  let emailList = users.map((user) => ({
    name: user.firstName + " " + user.lastName,
    email: user.email,
  }));

  res.status(200).json({
    status: "Success",
    users: emailList,
  });
}, "Failed to fetch all users");
