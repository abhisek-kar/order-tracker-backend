import { Redis } from "ioredis";
import appEnv from "./env";
import logger from "../utils/logger";

export let redisClient: any;

export function initializeRedis() {
  if (!redisClient) {
    redisClient = new Redis({
      host: appEnv.REDIS_HOST,
      port: appEnv.REDIS_PORT ? parseInt(appEnv.REDIS_PORT, 10) : 6379,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      connectTimeout: 10000,
      commandTimeout: 10000,
    });

    redisClient.on("connect", () => {
      logger.info("Redis connected successfully");
    });

    redisClient.on("error", (err: any) => {
      logger.error("Redis connection error:", err);
    });
  }
  return redisClient;
}

export async function getOrSetCache(
  key: string,
  fetchFn: () => Promise<any>,
  ttl = 3600
) {
  const client = initializeRedis();
  const cached = await client.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const freshData = await fetchFn();
  await client.set(key, JSON.stringify(freshData), "EX", ttl);
  return freshData;
}

export async function invalidateCache(key: string) {
  if (!redisClient) initializeRedis();
  await redisClient.del(key);
  logger.info(`Cache invalidated for key: ${key}`);
}

export async function clearRedis() {
  if (!redisClient) initializeRedis();
  await redisClient.flushall();
  logger.info("All Redis cache cleared");
}
