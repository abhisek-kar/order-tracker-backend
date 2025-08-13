import { NextFunction, Request, Response } from "express";
import {
  createOrder as createOrderService,
  getAllOrders as getAllOrdersService,
  getOrderById as getOrderByIdService,
  updateOrderStatus as updateOrderStatusService,
  updateOrderLocation as updateOrderLocationService,
} from "../services/orderService";
import { IOrder } from "../interfaces/IOrder";
import { success } from "zod";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerInfo, deliveryItem, preferredTime } = req.body as IOrder;

    if (!customerInfo || !deliveryItem || !preferredTime) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required order fields" });
    }

    const taskId = await createOrderService(
      customerInfo,
      deliveryItem,
      preferredTime
    );

    res.status(201).json({
      message: "Order placed successfully",
      success: true,
      data: {
        taskId,
      },
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
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
      search,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: "Page number must be greater than 0",
      });
    }

    if (limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100",
      });
    }

    const validSortFields = [
      "createdAt",
      "updatedAt",
      "status",
      "customerInfo.name",
      "preferredTime",
    ];
    if (sortBy && !validSortFields.includes(sortBy as string)) {
      return res.status(400).json({
        message: "Invalid sort field",
        validFields: validSortFields,
      });
    }

    const validSortOrders = ["asc", "desc"];
    if (sortOrder && !validSortOrders.includes(sortOrder as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sort order",
        validOrders: validSortOrders,
      });
    }

    const validStatuses = [
      "Scheduled",
      "Reached Store",
      "Picked Up",
      "Out for Delivery",
      "Delivered",
    ];

    if (status && !validStatuses.includes(status as string)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
        validStatuses,
      });
    }

    const result = await getAllOrdersService({
      page: pageNum,
      limit: limitNum,
      status: status as string,
      sortBy: sortBy as string,
      sortOrder: sortOrder as "asc" | "desc",
      search: search as string,
    });

    res.status(200).json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
      filters: {
        status: status || null,
        search: search || null,
        sortBy: sortBy || "createdAt",
        sortOrder: sortOrder || "desc",
      },
    });
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
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid status provided" });
    }

    const updatedOrder = await updateOrderStatusService(id, status);

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
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
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order location updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
