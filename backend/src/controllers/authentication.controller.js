import {
  findUserByEmail,
  createUser,
  signUser,
  updatePasswordInDatabase
} from "../services/authentication.service.js";
import logger from "../../config/logger.config.js";
import validator from "../utils/validation.js"; // Assuming there's a validator module
import apiAuth from "../utils/apiAuthentication.js";

/**
 * User Registration function
 *
 * Accepts: firstName, lastName, email, password
 * Validation: firstname, lastname not Null
 *             email - contain '@' and '.com'
 *             password - min 8, lowercase, uppercase, special character, numbers
 * API: /auth/registerUser
 */
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log(firstName, lastName, email, password);

    // Checking if email ID already present in database
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      const err = new Error("Email Id already present, please login!");
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
      const err = new Error("Invalid input data");
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
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | status : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await signUser(email, password);

    // const accessToken = apiAuth.generateAccessToken(req.body.email)

    res.status(200).json({
      status: "Success",
      message: "User Login Success",
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      // accessToken
    });
  } catch (error) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${error.status} | message: ${error.message} ${error.stack}`
    );
    res.status(error.status || 500).json({
      message: error.message,
    });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    // Check if the logged-in user is the same as the requested user
    apiAuth.validateUser(req.user, email);

    // Call the service to update the password
    const updateResponse = await updatePasswordInDatabase(email, oldPassword, newPassword);

    res.status(200).json({
      status: "Success",
      message: "Password updated successfully",
      userId: updateResponse,
    });
  } catch (err) {
    logger.error(
      `URL: ${req.originalUrl} | status: ${err.status} | message: ${err.message} ${err.stack}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

// export const resetPassword = async (req, res) => {};
// export const logout = async (req, res) => {};
// export const refreshToken = async (req, res) => {};
