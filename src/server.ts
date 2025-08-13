import express from "express";
import cors from "cors";
import appEnv from "./config/env";
import connectDB from "./config/dbConfig";
import v1Routes from "./routes/v1/index";
import { errorHandler } from "./middlewares/errorHandler";
import { createServer } from "http";
import { initializeSocketIo } from "./services/websocketService";
import seedDB from "./seeder";
import { notFoundHandler } from "./middlewares/notFoundHandler";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocketIo(httpServer);

// Middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1", v1Routes);

// 404 handler
app.use(notFoundHandler);

// error handler
app.use(errorHandler);

// Start the server
httpServer.listen(appEnv.PORT, () => {
  console.log(`Server is running on http://localhost:${appEnv.PORT}`);
  connectDB();
  seedDB();
});
