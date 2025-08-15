import { Queue } from "bullmq";
import { redisClient } from "../config/redisConfig.js";

export const emailQueue = new Queue("emailQueue", {
  connection: redisClient,
});

export async function addOrderEmail(to, context, isConfirmation = false) {
  return await emailQueue.add("orderUpdate", {
    type: "orderUpdate",
    to,
    context,
    isConfirmation,
  });
}
