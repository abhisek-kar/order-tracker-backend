import { Queue } from "bullmq";
import { redisConnectionConfig } from "../config/bullmqConfig.js";

export const emailQueue = new Queue("emailQueue", {
  connection: redisConnectionConfig,
});

export async function addOrderEmail(to, context, isConfirmation = false) {
  return await emailQueue.add("orderUpdate", {
    type: "orderUpdate",
    to,
    context,
    isConfirmation,
  });
}
