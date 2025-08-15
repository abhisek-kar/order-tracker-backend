import express from "express";
import cors from "cors";
import appEnv from "@/config/env.js";
import connectDB from "@/config/dbConfig.js";
import v1Routes from "@/routes/v1/index.js";
import { errorHandler } from "@/middlewares/errorHandler.js";
import { createServer } from "http";
import { initializeSocketIo } from "@/services/websocketService.js";
import seedDB from "@/seeder.js";
import { notFoundHandler } from "@/middlewares/notFoundHandler.js";
import { initializeRedis } from "@/config/redisConfig.js";
import { initializeEmailWorker } from "@/workers/emailWorker.js";
import morgan from "morgan";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocketIo(httpServer);

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan(appEnv.NODE_ENV === "production" ? "combined" : "dev"));

// routes
app.use("/api/v1", v1Routes);

// 404 handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

// Start the server
httpServer.listen(appEnv.PORT, () => {
  console.log(`Server is running `);
  connectDB();
  seedDB();
  initializeRedis();
  initializeEmailWorker();
});
