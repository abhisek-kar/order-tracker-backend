import { Router } from "express";
import orderRoutes from "./orderRoutes";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/orders", orderRoutes);
router.use("/auth", authRoutes);

export default router;
