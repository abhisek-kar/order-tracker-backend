import { Router } from "express";
import orderRoutes from "./orderRoutes";

const router = Router();

router.use("/orders", orderRoutes);

export default router;
