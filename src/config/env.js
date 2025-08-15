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
  JWT_EXPIRATION: z.string().default("100h"),
  EMAIL_HOST: z.string().default("smtp.gmail.com"),
  EMAIL_PORT: z.string().default("465"),
  EMAIL_USER: z.string().email({ message: "Invalid email" }).optional(),
  EMAIL_PASS: z.string().min(6).optional(),
  EMAIL_FROM: z.string().optional(),
  REDIS_URI: z.string().default("redis://localhost:6379"),
  REDIS_HOST: z.string().default("127.0.0.1"),
  REDIS_PORT: z.string().default("6379"),

  AGENT_EMAIL: z.string().email({ message: "Invalid agent email" }).optional(),
  AGENT_PASSWORD: z
    .string()
    .min(6, { message: "Agent password must be at least 6 characters" })
    .optional(),
  AGENT_NAME: z.string().min(1, { message: "Agent name is required" }),
});

const appEnv = envSchema.parse(process.env);

export default appEnv;
