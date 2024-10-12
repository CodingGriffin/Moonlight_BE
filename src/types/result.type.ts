import { Types } from "mongoose";
export type resultType = {
  id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  industry: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  googleReviewRating: Number;
  isFavorite?: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
};
