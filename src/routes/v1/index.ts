import { Router } from "express";
import orderRoutes from "@/routes/v1/orderRoutes.js";
import authRoutes from "@/routes/v1/authRoutes.js";

const router = Router();

router.use("/orders", orderRoutes);
router.use("/auth", authRoutes);

export default router;
