import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../../config/logger.config.js";

interface CustomError extends Error {
  status?: number;
}

interface UserPayload {
  id: string;
  email: string;
  [key: string]: any;
}

export interface AuthRequest extends Request {
  user?: string;
}

export const generateAccessToken = (user: UserPayload): string => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string);
};

export const validateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Bypass Authentication when DISABLE_API_AUTH is set in the env file for dev purpose only
  if (process.env.DISABLE_API_AUTH === "true") {
    next();
  } else {
    // Checking if authorization is present in the header, if not present then access is forbidden
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      logger.error(
        `URL : ${req.originalUrl} | API Authentication Fail | message: Token not present`
      );
      res.status(403).json({
        message: "Token not present",
      });
      return;
    }

    // The request header contains the token "Bearer <token>", split the string and use the second value in the split array
    const token = authHeader.split(" ")[1];

    // Function to verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (error, user) => {
      if (error) {
        logger.error(
          `URL : ${req.originalUrl} | API Authentication Fail | message: Invalid Token`
        );
        res.status(403).json({
          message: "Invalid Token",
        });
        return;
      }

      // Adding user data to the request
      req.user = user as string;
      // Proceed to the next action in the calling function
      next();
    });
  }
};

// Function to validate user
export const validateUser = (user: string, email: string): boolean => {
  if (process.env.DISABLE_API_AUTH != "true" && user != email) {
    const error: CustomError = new Error("Access Denied");
    error.status = 403;
    throw error;
  } else return true;
};