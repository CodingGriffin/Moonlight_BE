import { Types } from "mongoose";
import { resultType } from "./result.type";

export type sheetType = {
  id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  results: [resultType];
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
};
