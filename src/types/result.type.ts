import { Types } from "mongoose";
export type resultType = {
  id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  industry: string;
  formatted_address: string;
  phoneNumber: string;
  email: string;
  website: string;
  rating: Number;
  isFavorite?: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
};
