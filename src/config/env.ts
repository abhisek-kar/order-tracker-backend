import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000").transform(Number),
  MONGO_URI: z.string().url({ message: "Invalid MongoDB connection string" }),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  ADMIN_EMAIL: z.string().email({ message: "Invalid admin email" }).optional(),
  ADMIN_PASSWORD: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional(),
  ADMIN_NAME: z
    .string()
    .min(1, { message: "Admin name is required" })
    .optional(),
  JWT_SECRET: z
    .string()
    .min(1, { message: "JWT secret is required" })
    .optional(),
  JWT_EXPIRATION: z.string().default("1h"),
});

const appEnv = envSchema.parse(process.env);

export default appEnv;
