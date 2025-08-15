import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import appEnv from "../config/env.js";

export const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    appEnv.JWT_SECRET,
    { expiresIn: appEnv.JWT_EXPIRATION }
  );

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  };
};
