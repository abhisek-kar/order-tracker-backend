import mongoose, { Schema, Model } from "mongoose";

const OrderSchema = new Schema(
  {
    taskId: { type: String, required: true, unique: true },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    deliveryItem: { type: String, required: true },
    preferredTime: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: [
        "Scheduled",
        "Reached Store",
        "Picked Up",
        "Out for Delivery",
        "Delivered",
      ],
      default: "Scheduled",
    },
    agentInfo: {
      name: { type: String },
      phone: { type: String },
    },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    eta: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
