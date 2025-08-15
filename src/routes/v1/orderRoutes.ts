import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderLocation,
} from "@/controllers/orderController.js";
import { auth } from "@/middlewares/authMiddleware.js";

const router = Router();
// Public routes

// POST /orders -> Create task or order
router.post("/", createOrder);

// GET /orders/:id -> Task tracking info
router.get("/:id", getOrderById);

// Admin-protected routes

// GET /orders -> Get all tasks or orders
router.get("/", auth("admin", "agent"), getAllOrders);

// PATCH /orders/:id/status -> Update task stage
router.patch("/:id/status", auth("admin", "agent"), updateOrderStatus);

// PATCH /orders/:id/location -> Update task location
router.patch("/:id/location", auth("admin", "agent"), updateOrderLocation);

export default router;
