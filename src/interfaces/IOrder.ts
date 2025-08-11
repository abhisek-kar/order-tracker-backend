import mongoose, { Document, mongo } from "mongoose";

export type OrderStatus =
  | "Scheduled"
  | "Reached Store"
  | "Picked Up"
  | "Out for Delivery"
  | "Delivered";

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  taskId: string;
  customerInfo: {
    name: string;
    address: string;
    phone: string;
  };
  deliveryItem: string;
  preferredTime: string;
  status: OrderStatus;
  agentInfo?: {
    name: string;
    phone: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  eta?: string;
}
