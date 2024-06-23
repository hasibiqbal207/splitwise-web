import mongoose from "mongoose";
import logger from "./logger.config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      logger.info("MongoDB connected");
    });
  } catch (err) {
    logger.error(`DB Connection Fail | ${err.message}`);
  }
};

export default connectDB;
