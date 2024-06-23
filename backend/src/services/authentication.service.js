import model from "../models/index.js";
import bcrypt from "bcrypt";

// Function to check if email ID already exists
export const findUserByEmail = async (emailId) => {
  return await model.UserModel.findOne({ emailId });
};

// Function to create a new user
export const createUser = async (userData) => {
  // Bcrypt password encryption
  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);
  return await model.UserModel.create(userData);
};
