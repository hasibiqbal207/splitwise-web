import { findUserByEmail } from "../services/authentication.service.js";
import logger from "../../config/logger.config.js";
import { getGroupUsers } from "../services/group.service.js";

interface CustomError extends Error {
  status?: number;
}

// Function to check if a value is not null or undefined
export const notNull = (value: unknown): boolean => {
  return value !== null && value !== undefined; // && value.trim() !== ""
};

// Function to validate email format
export const emailValidation = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate password strength
export const passwordValidation = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const userValidation = async (email: string): Promise<boolean> => {
  const user = await findUserByEmail(email);
  return !!user;
};

export const currencyValidation = (currency: string): boolean => {
  if (
    currency &&
    (currency == "USD" || currency == "EUR" || currency == "BDT")
  ) {
    return true;
  } else {
    const error: CustomError = new Error("Currency validation fail!!");
    error.status = 400;
    throw error;
  }
};

export const groupUserValidation = async (
  email: string,
  groupId: string
): Promise<boolean> => {
  const groupData = await getGroupUsers(groupId);

  // Check if groupData exists and contains groupMembers
  if (groupData?.groupMembers.includes(email)) {
    return true;
  } else {
    logger.warn(
      `Group User Validation fail: Group ID: [${groupId}] | user: [${email}]`
    );
    return false;
  }
};

export default {
  notNull,
  emailValidation,
  passwordValidation,
  userValidation,
  currencyValidation,
};
