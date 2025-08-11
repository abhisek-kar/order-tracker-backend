import express from "express";
import cors from "cors";
import appEnv from "./config/env";
import connectDB from "./config/dbConfig";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Start the server
app.listen(appEnv.PORT, () => {
  console.log(`Server is running on http://localhost:${appEnv.PORT}`);
  connectDB();
});
