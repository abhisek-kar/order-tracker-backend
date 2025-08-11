import { v4 as uuidv4 } from "uuid";
import Order from "../models/Order";
import { IOrder } from "../interfaces/IOrder";

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
    throw new Error("Failed to create order");
  }
};
