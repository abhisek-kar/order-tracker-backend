import { Document } from "mongoose";

export type IUserRole = "admin" | "agent" | "customer";

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  role: IUserRole;
}
