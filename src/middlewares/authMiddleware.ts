import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import appEnv from "../config/env.js";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: "admin" | "agent" | "customer";
  };
}

export const auth =
  (...roles: Array<"admin" | "agent" | "customer">) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      if (!appEnv.JWT_SECRET) {
        next(new Error("Failed to authenticate user"));
      }
      const decoded = jwt.verify(
        token,
        appEnv.JWT_SECRET as string
      ) as unknown as {
        id: string;
        role: string;
      };
      req.user = { id: decoded.id, role: decoded.role as any };

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
