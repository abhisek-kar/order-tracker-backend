import { Queue } from "bullmq";
import { redisClient } from "@/config/redisConfig";

export const emailQueue = new Queue("emailQueue", {
  connection: redisClient,
});

export async function addOrderEmail(
  to: string,
  context: any,
  isConfirmation: boolean = false
) {
  return await emailQueue.add("orderUpdate", {
    type: "orderUpdate",
    to,
    context,
    isConfirmation,
  });
}
