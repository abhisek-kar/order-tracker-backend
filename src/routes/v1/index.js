import { Router } from "express";
import orderRoutes from "./orderRoutes.js";
import authRoutes from "./authRoutes.js";

const router = Router();

router.use("/orders", orderRoutes);
router.use("/auth", authRoutes);

export default router;
