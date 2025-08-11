import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import appEnv from "./config/env";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(appEnv.MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

// Start the server
app.listen(appEnv.PORT, () => {
  console.log(`Server is running on http://localhost:${appEnv.PORT}`);
  connectDB();
});
