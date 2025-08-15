import { Redis } from "ioredis";
import appEnv from "./env.js";
import logger from "../utils/logger.js";

let redisClient;

function initializeRedis() {
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

    redisClient.on("error", (err) => {
      logger.error("Redis connection error:", err);
    });
  }
  return redisClient;
}

async function getOrSetCache(key, fetchFn, ttl = 3600) {
  const client = initializeRedis();
  const cached = await client.get(key);
  if (cached) {
    return JSON.parse(cached);
  }

  const freshData = await fetchFn();
  await client.set(key, JSON.stringify(freshData), "EX", ttl);
  return freshData;
}

async function invalidateCache(key) {
  if (!redisClient) initializeRedis();
  await redisClient.del(key);
  logger.info(`Cache invalidated for key: ${key}`);
}

async function clearRedis() {
  if (!redisClient) initializeRedis();
  await redisClient.flushall();
  logger.info("All Redis cache cleared");
}

export {
  redisClient,
  initializeRedis,
  getOrSetCache,
  invalidateCache,
  clearRedis,
};
