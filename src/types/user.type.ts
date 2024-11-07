import { Types } from "mongoose";
export type userType = {
  id?: Types.ObjectId;
  googleId: string;
  name: string;
  email: string;
  password: string;
  role: number;
  picture: string;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
};
