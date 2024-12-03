import { Types } from "mongoose";
export type emailType = {
  id?: Types.ObjectId;
  userID: Types.ObjectId;
  recipient: string;
  subject: string;
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
};
