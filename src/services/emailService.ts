import { SendMailOptions } from "nodemailer";
import transporter from "@/config/emailConfig";
import logger from "@/utils/logger";
import appEnv from "@/config/env";

interface EmailContext {
  name: string;
  orderId: string;
  status: string;
  deliveryItem?: string;
  preferredTime?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  location?: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  [key: string]: any;
}

interface HandlebarsMailOptions extends SendMailOptions {
  template: string;
  context: any;
}

class EmailService {
  public async sendOrderEmail(
    to: string,
    context: EmailContext,
    isConfirmation: boolean = false
  ) {
    const emailContext = {
      ...context,
      emailTitle: isConfirmation ? "Order Confirmation" : "Order Status Update",
      greeting: isConfirmation
        ? "Thank you for your order! We're pleased to confirm that your order has been received and is being processed."
        : "We have an update on your order!",
      statusClass: this.getStatusClass(context.status),
      statusMessage: this.getStatusMessage(context.status, isConfirmation),
    };

    await this.sendEmail({
      to,
      subject: isConfirmation
        ? "Your Order Confirmation"
        : `Order Update: ${context.status}`,
      template: "orderUpdate",
      context: emailContext,
    });
  }

  private getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      Scheduled: "scheduled",
      "Reached Store": "reached-store",
      "Picked Up": "picked-up",
      "Out for Delivery": "out-for-delivery",
      Delivered: "delivered",
    };
    return statusMap[status] || "scheduled";
  }

  private getStatusMessage(status: string, isConfirmation: boolean): string {
    if (isConfirmation) {
      return "Your order has been scheduled and we're preparing it for delivery. We'll keep you updated as your order progresses.";
    }

    const messageMap: { [key: string]: string } = {
      Scheduled:
        "Your order has been scheduled and we're preparing it for delivery.",
      "Reached Store":
        "Our delivery agent has reached the store to pick up your order.",
      "Picked Up": "Your order has been picked up and is on its way to you!",
      "Out for Delivery":
        "Your order is out for delivery. Our agent will be with you soon!",
      Delivered: "Great news! Your order has been delivered successfully.",
    };
    return messageMap[status] || "Your order status has been updated.";
  }

  private async sendEmail({
    to,
    subject,
    template,
    context,
  }: {
    to: string;
    subject: string;
    template: string;
    context: any;
  }) {
    try {
      await transporter.sendMail({
        from: appEnv.EMAIL_FROM,
        to,
        subject,
        template,
        context,
      } as HandlebarsMailOptions);

      logger.info(`Email sent to ${to} using template ${template}`);
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}

export default new EmailService();
