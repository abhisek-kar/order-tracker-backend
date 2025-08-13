import { Worker, Job } from "bullmq";
import emailService from "../services/emailService";
import logger from "../utils/logger";
import { redisClient, initializeRedis } from "../config/redisConfig";

interface EmailJobData {
  type: "orderEmail";
  to: string;
  context: any;
  isConfirmation: boolean;
}

export let emailWorker: Worker;

export function initializeEmailWorker() {
  if (!redisClient) initializeRedis();

  emailWorker = new Worker(
    "emailQueue",
    async (job: Job<EmailJobData>) => {
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
      connection: redisClient,
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
