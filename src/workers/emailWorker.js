import { Worker, Job } from "bullmq";
import emailService from "../services/emailService.js";
import logger from "../utils/logger.js";
import { redisConnectionConfig } from "../config/bullmqConfig.js";

export let emailWorker;

export function initializeEmailWorker() {
  emailWorker = new Worker(
    "emailQueue",
    async (job) => {
      logger.info(`Processing email job ${job.id} of type ${job.data.type}`);

      try {
        await emailService.sendOrderEmail(
          job.data.to,
          job.data.context,
          job.data.isConfirmation
        );
      } catch (error) {
        logger.error(`Failed to process email job ${job.id}:`, error);
        throw error;
      }
    },
    {
      connection: redisConnectionConfig,
      concurrency: 5,
    }
  );

  emailWorker.on("completed", (job) => {
    logger.info(`Email job ${job.id} completed successfully`);
  });

  emailWorker.on("failed", (job, err) => {
    logger.error(`Email job ${job?.id} failed:`, err);
  });

  return emailWorker;
}
