import { NextFunction, Request, Response } from "express";
import { login as loginService } from "../services/authService";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const { token, user } = await loginService(email, password);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token, user },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
};
