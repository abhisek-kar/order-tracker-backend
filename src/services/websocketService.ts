import { Server as SocketIoServer } from "socket.io";
import { Server as HttpServer } from "http";
import { IOrder } from "../interfaces/IOrder.js";
import logger from "../utils/logger.js";

let io: SocketIoServer;

export const initializeSocketIo = (httpServer: HttpServer) => {
  io = new SocketIoServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on("joinOrderRoom", (taskId: string) => {
      socket.join(taskId);
      logger.info(`User ${socket.id} joined room for taskId: ${taskId}`);
    });

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });
};

export const emitOrderUpdate = (order: IOrder) => {
  if (io) {
    io.to(order.taskId).emit("orderUpdate", order);
  }
};
