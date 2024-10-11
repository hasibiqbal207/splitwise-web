import createHttpError from "http-errors";
import UserModel, { UserDocument } from "../models/user.model.js";
import bcrypt from "bcrypt";
import validator from "../utils/validation.js";

interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Function to check if email ID already exists
export const findUserByEmail = async (
  email: string
): Promise<UserDocument | null> => {
  return await UserModel.findOne({ email });
};

// Function to create a new user
export const createUser = async (userData: CreateUserInput) => {
  // Bcrypt password encryption
  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);

  const newUser = new UserModel(userData);
  return await newUser.save();
};

// Sign in a user by email and password
export const signUser = async (
  email: string,
  password: string
): Promise<UserDocument> => {
  const user = await UserModel.findOne({ email: email });

  // Check if user exists
  if (!user) throw createHttpError.NotFound("Invalid credentials.");

  // Compare passwords
  const passwordMatches = await bcrypt.compare(password, user.password);

  // Check if passwords match
  if (!passwordMatches) {
    throw createHttpError.NotFound(
      "Invalid credentials. Password does not match."
    );
  }

  return user;
};

// Update a user's password in the database
export const updatePasswordInDatabase = async (
  email: string,
  oldPassword: string,
  newPassword: string
): Promise<UserDocument | null> => {
  // Checking if the user exists
  const user = await UserModel.findOne({ email });

  if (!user) {
    const error = new Error("User does not exist!");
    (error as any).status = 400;
    throw error;
  }

  // Performing basic validations
  validator.notNull(oldPassword);
  validator.passwordValidation(newPassword);

  // Validating the old password using bcrypt
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    const error = new Error("Old password does not match");
    (error as any).status = 400;
    throw error;
  }

  // Encrypting the new password using bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Updating the user's password in the database
  const updatedResponse = await UserModel.findOneAndUpdate(
    { email },
    { $set: { password: hashedPassword } },
    { new: true, select: '-password' }
  );

  return updatedResponse;
};
