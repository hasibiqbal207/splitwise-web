import { Request, Response } from "express";
import logger from "../../config/logger.config.js";

interface CustomError extends Error {
  status?: number;
}

const handleAsync = (
  fn: (req: Request, res: Response) => Promise<void>,
  customErrorMessage?: string
) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      await fn(req, res);
    } catch (err) {
      const error = err as CustomError;
      logger.error(
        `URL : ${req.originalUrl} | status : ${error.status} | message: ${customErrorMessage ?? error.message} | stack: ${error.stack}`
      );
      res
        .status(500)
        .json({
          message:
            (customErrorMessage ??
            error.message) ||
            "An unexpected error occurred",
        });
    }
  };
};

export default handleAsync;
