import { createClient } from "redis";
import logger from "../utils/logger.js";

export let redisClient;

export const initializeRedis = async () => {
  try {
    redisClient = createClient({
      username: "default",
      password: "3Um3ng5hMpWNyXRXx4UOxMLozmBzKcGe",
      socket: {
        host: "redis-10245.c9.us-east-1-4.ec2.redns.redis-cloud.com",
        port: 10245,
      },
    });

    redisClient.on("connect", () => {
      logger.info("Redis client connected successfully");
    });

    redisClient.on("ready", () => {
      logger.info("Redis client is ready to use");
    });

    redisClient.on("end", () => {
      logger.warn("Redis client connection closed");
    });

    redisClient.on("reconnecting", () => {
      logger.info("Redis client is reconnecting");
    });
    
    redisClient.on("error", (err) => {
      logger.error("Redis Client Error", err);
    });

    await redisClient.connect();
    logger.info("Redis connected successfully");
  } catch (error) {
    logger.error("Failed to initialize Redis:", error);
  }
};

export async function getOrSetCache(key, fetchFn, ttl = 3600) {
  if (!redisClient || !redisClient.isOpen) {
    logger.warn("Redis not connected, executing function directly");
    return await fetchFn();
  }
  
  try {
    const cached = await redisClient.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const freshData = await fetchFn();
    await redisClient.setEx(key, ttl, JSON.stringify(freshData));
    return freshData;
  } catch (error) {
    logger.error("Redis cache error:", error);
    return await fetchFn();
  }
}

export async function invalidateCache(key) {
  if (!redisClient || !redisClient.isOpen) {
    logger.warn("Redis not connected, cannot invalidate cache");
    return;
  }
  
  try {
    await redisClient.del(key);
    logger.info(`Cache invalidated for key: ${key}`);
  } catch (error) {
    logger.error("Redis invalidate error:", error);
  }
}

export async function clearRedis() {
  if (!redisClient || !redisClient.isOpen) {
    logger.warn("Redis not connected, cannot clear cache");
    return;
  }
  
  try {
    await redisClient.flushAll();
    logger.info("All Redis cache cleared");
  } catch (error) {
    logger.error("Redis clear error:", error);
  }
}
