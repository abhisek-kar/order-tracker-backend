import { v4 as uuidv4 } from "uuid";
import Order from "../models/Order";
import { IOrder } from "../interfaces/IOrder";
import logger from "../utils/logger";
import { emitOrderUpdate } from "./websocketService";

export const createOrder = async (
  customerInfo: IOrder["customerInfo"],
  deliveryItem: string,
  preferredTime: string
): Promise<string> => {
  try {
    const newOrder = new Order({
      taskId: uuidv4(),
      customerInfo,
      deliveryItem,
      preferredTime,
      status: "Scheduled",
    });

    const savedOrder = await newOrder.save();
    return savedOrder.taskId;
  } catch (error) {
    logger.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
};

export const getAllOrders = async (): Promise<IOrder[]> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return orders;
  } catch (error) {
    logger.error("Error retrieving orders:", error);
    throw new Error("Failed to retrieve orders");
  }
};

export const getOrderById = async (taskId: string): Promise<IOrder | null> => {
  try {
    const order = await Order.findOne({ taskId });
    return order;
  } catch (error) {
    logger.error("Error retrieving order by ID:", error);
    throw new Error("Failed to retrieve order");
  }
};

export const updateOrderStatus = async (
  taskId: string,
  status: IOrder["status"]
): Promise<IOrder | null> => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { taskId },
      { status },
      { new: true }
    );
    if (updatedOrder) {
      emitOrderUpdate(updatedOrder);
    }
    return updatedOrder;
  } catch (error) {
    logger.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};

export const updateOrderLocation = async (
  taskId: string,
  location: IOrder["location"]
): Promise<IOrder | null> => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { taskId },
      { location },
      { new: true }
    );
    if (updatedOrder) {
      emitOrderUpdate(updatedOrder);
    }
    return updatedOrder;
  } catch (error) {
    logger.error("Error updating order location:", error);
    throw new Error("Failed to update order location");
  }
};
