import { Router } from "express";
import orderRoutes from "@/routes/v1/orderRoutes";
import authRoutes from "@/routes/v1/authRoutes";

const router = Router();

router.use("/orders", orderRoutes);
router.use("/auth", authRoutes);

export default router;
