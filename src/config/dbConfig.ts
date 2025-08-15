import mongoose from "mongoose";
import logger from "@/utils/logger.js";
import appEnv from "@/config/env.js";

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    logger.info("MongoDB is already connected.");
    return;
  }
  try {
    await mongoose.connect(appEnv.MONGO_URI);
    logger.info("Connected to MongoDB");

    mongoose.connection.on("disconnected", () => {
      logger.warn("Lost MongoDB connection");
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("Reconnected to MongoDB");
    });
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
