import dotenv from "dotenv";
import User from "@/models/User.js";
import appEnv from "@/config/env.js";
import logger from "@/utils/logger.js";

dotenv.config();

const seedAdmin = async () => {
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

const seedAgent = async () => {
  try {
    const agentUserExists = await User.findOne({ role: "agent" });
    if (!agentUserExists) {
      await User.create({
        name: appEnv.AGENT_NAME || "Agent User",
        email: appEnv.AGENT_EMAIL || "agent@tracker.com",
        password: appEnv.AGENT_PASSWORD || "Agent@123",
        role: "agent",
      });
      logger.info("Agent user created successfully!");
    } else {
      logger.info("Agent user already exists.");
    }
  } catch (error) {
    logger.error("Error seeding the database:", error);
  }
};
const seedDB = async () => {
  await seedAdmin();
  await seedAgent();
};

export default seedDB;
