import { v4 as uuidv4 } from "uuid";
import Order from "../models/Order.js";
import logger from "../utils/logger.js";
import { emitOrderUpdate } from "./websocketService.js";
import { addOrderEmail } from "../queues/emailQueue.js";

export const createOrder = async (
  customerInfo,
  deliveryItem,
  preferredTime
) => {
  try {
    const newOrder = new Order({
      taskId: uuidv4(),
      customerInfo,
      deliveryItem,
      preferredTime,
      status: "Scheduled",
    });

    const savedOrder = await newOrder.save();
    await addOrderEmail(
      customerInfo.email,
      {
        name: customerInfo.name,
        orderId: savedOrder.taskId,
        status: "Scheduled",
        deliveryItem: deliveryItem,
        preferredTime: preferredTime,
        customerPhone: customerInfo.phone,
        deliveryAddress: customerInfo.address,
      },
      true
    );

    return savedOrder.taskId;
  } catch (error) {
    logger.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
};

export const getAllOrders = async (options = {}) => {
  try {
    const {
      page = 1,
      limit = 100,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = options;

    const filter = {};

    // if user role is agent show only out for pickup and out for delivery orders
    if (options.userRole === "agent") {
      filter.status = {
        $in: ["Out for Delivery", "Picked Up"],
      };
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { "customerInfo.name": { $regex: search, $options: "i" } },
        { "customerInfo.email": { $regex: search, $options: "i" } },
        { deliveryItem: { $regex: search, $options: "i" } },
        { taskId: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const sortObject = {};
    sortObject[sortBy] = sortOrder === "asc" ? 1 : -1;

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter).sort(sortObject).skip(skip).limit(limit).lean(),
      Order.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    logger.info(
      `Retrieved ${orders.length} orders (page ${page} of ${totalPages})`
    );

    return {
      orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNextPage,
        hasPrevPage,
      },
    };
  } catch (error) {
    logger.error("Error retrieving orders:", error);
    throw new Error("Failed to retrieve orders");
  }
};

export const getOrderById = async (taskId) => {
  try {
    const order = await Order.findOne({ taskId });
    return order;
  } catch (error) {
    logger.error("Error retrieving order by ID:", error);
    throw new Error("Failed to retrieve order");
  }
};

export const updateOrderStatus = async (taskId, status) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { taskId },
      { status },
      { new: true }
    );
    if (updatedOrder) {
      emitOrderUpdate(updatedOrder);
      await addOrderEmail(
        updatedOrder.customerInfo.email,
        {
          name: updatedOrder.customerInfo.name,
          orderId: updatedOrder.taskId,
          status: status,
          location: updatedOrder.location,
        },
        false
      );
    } else {
      throw new Error("Order not found");
    }

    return updatedOrder;
  } catch (error) {
    logger.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};

export const updateOrderLocation = async (taskId, location) => {
  console.log(`Updating location for order ${taskId} to`, location);
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
