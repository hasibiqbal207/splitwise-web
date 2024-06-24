import createHttpError from "http-errors";
import { UserModel } from "../models/index.js";
import bcrypt from "bcrypt";

// Function to check if email ID already exists
export const findUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};

// Function to create a new user
export const createUser = async (userData) => {
  // Bcrypt password encryption
  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);
  return await UserModel(userData).save();
};

/**
 * Signs in a user with the provided email and password.
 *
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @return {Promise<Object>} - A promise that resolves to the user object if the credentials are valid,
 *                            or throws an error if the credentials are invalid.
 * @throws {NotFound} - If the user with the provided email does not exist or the passwords do not match.
 */
export const signUser = async (email, password) => {
  console.log(email, password);
  const user = await UserModel.findOne({ email: email });

  //check if user exist
  if (!user) throw createHttpError.NotFound("Invalid credentials.");

  //compare passwords
  let passwordMatches = await bcrypt.compare(password, user.password);

  // check if passwords match
  if (!passwordMatches)
    throw createHttpError.NotFound(
      "Invalid credentials. Password does not match."
    );

  return user;
};
