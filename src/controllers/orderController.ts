import { NextFunction, Request, Response } from "express";
import {
  createOrder as createOrderService,
  getAllOrders as getAllOrdersService,
  getOrderById as getOrderByIdService,
  updateOrderStatus as updateOrderStatusService,
  updateOrderLocation as updateOrderLocationService,
} from "../services/orderService";
import { IOrder } from "../interfaces/IOrder";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerInfo, deliveryItem, preferredTime } = req.body as IOrder;

    if (!customerInfo || !deliveryItem || !preferredTime) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    const taskId = await createOrderService(
      customerInfo,
      deliveryItem,
      preferredTime
    );

    res.status(201).json({
      message: "Order placed successfully",
      taskId,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orders = await getAllOrdersService();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = [
      "Scheduled",
      "Reached Store",
      "Picked Up",
      "Out for Delivery",
      "Delivered",
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided" });
    }

    const updatedOrder = await updateOrderStatusService(id, status);

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

export const updateOrderLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { location } = req.body;

    if (
      !location ||
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number"
    ) {
      return res
        .status(400)
        .json({ message: "Invalid location data provided" });
    }

    const updatedOrder = await updateOrderLocationService(id, location);

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
