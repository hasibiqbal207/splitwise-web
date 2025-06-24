import {
  findUserByEmail,
  createUser,
  signUser,
  updatePasswordInDatabase,
} from "../services/authentication.service.js";
import validator from "../utils/validation.js";
import { Request, Response } from "express";
import {
  AuthRequest,
  generateAccessToken,
  validateUser,
} from "../utils/apiAuthentication.js";
import handleAsync from "../utils/handleAsync.js";

interface CustomError extends Error {
  status?: number;
}

export const registerUser = handleAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  // Checking if email ID already present in the database
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const err: CustomError = new Error(
      "Email Id already present, please login!"
    );
    err.status = 400;
    throw err;
  }

  // Performing validations
  if (
    !validator.notNull(firstName) ||
    !validator.notNull(lastName) ||
    !validator.emailValidation(email) ||
    !validator.passwordValidation(password)
  ) {
    const err: CustomError = new Error("Invalid input data");
    err.status = 400;
    throw err;
  }

  // Creating user data object
  const newUser = { firstName, lastName, email, password };

  // Storing user details in DB
  const createdUser = await createUser(newUser);

  res.status(200).json({
    status: "Success",
    message: "User Registration Successful",
    userId: createdUser.id,
  });
}, "Failed to create an user");

export const loginUser = handleAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await signUser(email, password);

  const accessToken = generateAccessToken(req.body.email);

  res.status(200).json({
    status: "Success",
    message: "User Login Successful",
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    accessToken: accessToken,
  });
}, "Failed to login an user");

export const updatePassword = handleAsync(
  async (req: AuthRequest, res: Response) => {
    const { email, oldPassword, newPassword } = req.body;

    // Ensure user is authenticated and is the same user as the requested email
    if (!req.user) {
      const err: CustomError = new Error("User not authenticated");
      err.status = 401;
      throw err;
    }

    validateUser(req.user, email);

    // Call the service to update the password
    const updateResponse = await updatePasswordInDatabase(
      email,
      oldPassword,
      newPassword
    );

    res.status(200).json({
      status: "Success",
      message: "Password updated successfully",
      user: updateResponse,
    });
  },
  "Failed to update password"
);
