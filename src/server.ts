import express from "express";
import cors from "cors";
import appEnv from "./config/env";
import connectDB from "./config/dbConfig";
import v1Routes from "./routes/v1/index";
import { errorHandler } from "./middlewares/errorHandler";
import { createServer } from "http";
import { initializeSocketIo } from "./services/websocketService";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocketIo(httpServer);

// Middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1", v1Routes);

// error handler
app.use(errorHandler);

// Start the server
app.listen(appEnv.PORT, () => {
  console.log(`Server is running on http://localhost:${appEnv.PORT}`);
  connectDB();
});
