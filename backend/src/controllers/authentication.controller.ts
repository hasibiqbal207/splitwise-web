import {
  findUserByEmail,
  createUser,
  signUser,
  updatePasswordInDatabase
} from "../services/authentication.service.js";
import validator from "../utils/validation.js"; // Assuming there's a validator module
import { Request, Response } from 'express';
import {generateAccessToken, validateUser} from "../utils/apiAuthentication.js";
import handleAsync from "../utils/handleAsync.js";

interface CustomError extends Error {
  status?: number;
}

/**
 * User Registration function
 *
 * Accepts: firstName, lastName, email, password
 * Validation: firstname, lastname not Null
 *             email - contain '@' and '.com'
 *             password - min 8, lowercase, uppercase, special character, numbers
 * API: /auth/registerUser
 */
export const registerUser = handleAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  // Checking if email ID already present in the database
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    const err: CustomError = new Error("Email Id already present, please login!");
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
}, 'Failed to create user');


export const loginUser = handleAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await signUser(email, password);

  const accessToken = generateAccessToken(req.body.email)

  res.status(200).json({
    status: "Success",
    message: "User Login Success",
    userId: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    accessToken: accessToken
  });
}, 'Failed to login user');

export const updatePassword = handleAsync(async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;

  // Ensure user is authenticated and is the same user as the requested email
  // if (!req.user) {
  //   const err: CustomError = new Error('User not authenticated');
  //   err.status = 401;
  //   throw err;
  // }

  // // Check if the logged-in user is the same as the requested user
  validateUser(req.body.email, email);

  // Call the service to update the password
  const updateResponse = await updatePasswordInDatabase(email, oldPassword, newPassword);

  // Send success response
  res.status(200).json({
    status: "Success",
    message: "Password updated successfully",
    userId: updateResponse,
  });
}, 'Failed to create user');

// Extend the Request type to include `user`
interface AuthenticatedRequest extends Request {
  user?: { email: string; id: string }; // Adjust `user` fields based on actual structure
}

// export const resetPassword = async (req, res) => {};
// export const logout = async (req, res) => {};
// export const refreshToken = async (req, res) => {};
