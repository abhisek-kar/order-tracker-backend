import dotenv from "dotenv";
import User from "./models/User";
import appEnv from "./config/env";
import logger from "./utils/logger";

dotenv.config();

const seedDB = async () => {
  try {
    const adminUserExists = await User.findOne({ role: "admin" });
    if (!adminUserExists) {
      await User.create({
        name: appEnv.ADMIN_NAME || "Admin User",
        email: appEnv.ADMIN_EMAIL || "admin@tracker.com",
        password: appEnv.ADMIN_PASSWORD || "Admin@123",
        role: "admin",
      });
      logger.info("Admin user created successfully!");
    } else {
      logger.info("Admin user already exists.");
    }
  } catch (error) {
    logger.error("Error seeding the database:", error);
  }
};

export default seedDB;
