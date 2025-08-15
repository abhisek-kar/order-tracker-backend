import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import logger from "../utils/logger.js";

let io;

export const initializeSocketIo = (httpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on("joinOrderRoom", (taskId) => {
      socket.join(taskId);
      logger.info(`User ${socket.id} joined room for taskId: ${taskId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });
};

export const emitOrderUpdate = (order) => {
  if (io) {
    io.to(order.taskId).emit("orderUpdate", order);
  }
};
