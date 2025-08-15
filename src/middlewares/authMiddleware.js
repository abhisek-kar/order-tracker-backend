import jwt from "jsonwebtoken";
import appEnv from "../config/env.js";

export const auth =
  (...roles) =>
  (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      if (!appEnv.JWT_SECRET) {
        next(new Error("Failed to authenticate user"));
      }
      const decoded = jwt.verify(token, appEnv.JWT_SECRET);
      req.user = { id: decoded.id, role: decoded.role };

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
