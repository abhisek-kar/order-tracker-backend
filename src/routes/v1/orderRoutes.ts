import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderLocation,
} from "../../controllers/orderController";

const router = Router();

// POST /orders -> Create task or order
router.post("/", createOrder);

// GET /orders -> Get all tasks or orders
router.get("/", getAllOrders);

// GET /orders/:id -> Task tracking info
router.get("/:id", getOrderById);

// PATCH /orders/:id/status -> Update task stage
router.patch("/:id/status", updateOrderStatus);

// PATCH /orders/:id/location -> Update task location
router.patch("/:id/location", updateOrderLocation);

export default router;
