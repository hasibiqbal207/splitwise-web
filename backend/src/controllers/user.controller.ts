import {validateUser, } from "../utils/apiAuthentication.js";
import logger from "../../config/logger.config.js";

import {
  deleteUserByEmail,
  fetchUserByEmail,
  updateUserData,
  fetchAllUsers,
} from "../services/user.service.js";
import * as validator from "../utils/validation.js";

export const viewUserProfile = async (req, res) => {
  try {
    const { email } = req.body;
    logger.error("Checking user: " + email);

    validateUser(req.user, email); //[Check]

    const user = await fetchUserByEmail(email);

    if (!user) {
      const err = new Error("User does not exist!");
      err.status = 400;
      throw err;
    }

    logger.error("User: " + user);
    res.status(200).json({
      status: "Success",
      message: "User fetched successfully",
      user,
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

export const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    validateUser(req.user, email); //[Check]
    const userCheck = await validator.userValidation(email);
    if (!userCheck) {
      const err = new Error("User does not exist!");
      err.status = 400;
      throw err;
    }

    // Performing validations
    if (validator.notNull(firstName) && validator.notNull(lastName)) {
      //storing user details in DB
      const updatedResponse = await updateUserData(firstName, lastName, email);
      res.status(200).json({
        status: "Success",
        message: "User update Success",
        response: updatedResponse,
      });
    }
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    validateUser(req.user, email); //[Check]
    const userCheck = await validator.userValidation(email);
    if (!userCheck) {
      const err = new Error("User does not exist!");
      err.status = 400;
      throw err;
    }

    const deleteUserResponse = await deleteUserByEmail(email);

    res.status(200).json({
      status: "Success",
      message: "User Account deleted!",
      response: deleteUserResponse,
    });
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await fetchAllUsers();

    if (!users) {
      const err = new Error("User does not exist!");
      err.status = 400;
      throw err;
    }

    let emailList = [];
    for (const user of users) {
      emailList.push(user.email);
    }

    res.status(200).json({
      status: "Success",
      users: emailList,
    });
  } catch (err) {
    logger.error(
      `URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`
    );
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};
