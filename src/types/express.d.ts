import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
        role: "admin" | "agent" | "customer";
        name?: string;
      };
    }
  }
}
