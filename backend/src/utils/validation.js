import { findUserByEmail } from "../services/authentication.service.js";

// Function to check if a value is not null or undefined
export const notNull = (value) => {
  return value !== null && value !== undefined && value.trim() !== "";
};

// Function to validate email format
export const emailValidation = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Function to validate password strength
export const passwordValidation = (password) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const userValidation = async (email) => {
  const user = await findUserByEmail(email);
  return !!user;
};

export const currencyValidation = (currency) => {
  if (
    (currency && currency == "USD" ||
    currency == "EUR" ||
    currency == "BDT")
  ) {
    return true;
  } else {
    const err = new Error("Currency validation fail!!");
    err.status = 400;
    throw err;
  }
};

export default {
  notNull,
  emailValidation,
  passwordValidation,
  userValidation,
  currencyValidation,
};