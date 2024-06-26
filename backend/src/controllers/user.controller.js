import apiAuth from "../utils/apiAuthentication.js";
import logger from "../../config/logger.config.js";

import { deleteUserByEmail, fetchUserByEmail } from "../services/user.service.js";
import {userValidation} from "../utils/validation.js"

export const viewUserProfile = async (req, res) => {
    try {
        const { email} = req.body;

        apiAuth.validateUser(req.user, email); //[Check]

        const user = await fetchUserByEmail(email)

        if(!user) {
            const err = new Error("User does not exist!")
            err.status = 400
            throw err
        }

        res.status(200).json({
            status: "Success",
            message: "User fetched successfully",
            user
        });
    } catch (error) {
        logger.error(
            `URL : ${req.originalUrl} | staus : ${error.status} | message: ${error.message} ${error.stack}`
        );
        res.status(error.status || 500).json({
            message: error.message,
        });
    }
}

export const updateUserProfile = async (req, res) => {

}

export const deleteUser = async (req, res) => {
    try {
        const { email } = req.body;

        apiAuth.validateUser(req.user, email); //[Check]
        const userCheck = await userValidation(email);
        if(!userCheck) {
            const err = new Error("User does not exist!")
            err.status = 400
            throw err
        }

        const deleteUserResponse = await deleteUserByEmail(email)

        res.status(200).json({
            status: "Success",
            message: "User Account deleted!",
            response: deleteUserResponse
        })
    } catch (err) {
        logger.error(`URL : ${req.originalUrl} | staus : ${err.status} | message: ${err.message}`)
        res.status(err.status || 500).json({
            message: err.message
        })
    }
}