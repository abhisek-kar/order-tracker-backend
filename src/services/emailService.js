import transporter from "../config/emailConfig.js";
import logger from "../utils/logger.js";
import appEnv from "../config/env.js";

class EmailService {
  async sendOrderEmail(to, context, isConfirmation = false) {
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

  getStatusClass(status) {
    const statusMap = {
      Scheduled: "scheduled",
      "Reached Store": "reached-store",
      "Picked Up": "picked-up",
      "Out for Delivery": "out-for-delivery",
      Delivered: "delivered",
    };
    return statusMap[status] || "scheduled";
  }

  getStatusMessage(status, isConfirmation) {
    if (isConfirmation) {
      return "Your order has been scheduled and we're preparing it for delivery. We'll keep you updated as your order progresses.";
    }

    const messageMap = {
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

  async sendEmail({ to, subject, template, context }) {
    try {
      await transporter.sendMail({
        from: appEnv.EMAIL_FROM,
        to,
        subject,
        template,
        context,
      });

      logger.info(`Email sent to ${to} using template ${template}`);
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}

export default new EmailService();
