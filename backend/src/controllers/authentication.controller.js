import { findUserByEmail, createUser } from "../services/authentication.service.js";
import logger from "../../config/logger.config.js";
import validator from "../utils/validation.js"; // Assuming there's a validator module

/**
 * User Registration function
 * 
 * Accepts: firstName, lastName, emailId, password 
 * Validation: firstname, lastname not Null 
 *             emailID - contain '@' and '.com' 
 *             password - min 8, lowercase, uppercase, special character, numbers
 * API: /user/register
 */
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    // Checking if email ID already present in database
    const existingUser = await findUserByEmail(emailId);
    if (existingUser) {
      const err = new Error("Email Id already present, please login!");
      err.status = 400;
      throw err;
    }

    // Performing validations
    if (
      !validator.notNull(firstName) ||
      !validator.notNull(lastName) ||
      !validator.emailValidation(emailId) ||
      !validator.passwordValidation(password)
    ) {
      const err = new Error("Invalid input data");
      err.status = 400;
      throw err;
    }

    // Creating user data object
    const newUser = { firstName, lastName, emailId, password };

    // Storing user details in DB
    const createdUser = await createUser(newUser);
    res.status(200).json({
      status: "Success",
      message: "User Registration Successful",
      userId: createdUser.id,
    });
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | status : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

const loginUser = async (req, res) => {};


export default { registerUser };