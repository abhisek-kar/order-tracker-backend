import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000").transform(Number),
  MONGO_URI: z.string().url({ message: "Invalid MongoDB connection string" }),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

const appEnv = envSchema.parse(process.env);

export default appEnv;
