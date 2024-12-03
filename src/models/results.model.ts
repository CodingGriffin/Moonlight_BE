import mongoose, { Schema } from "mongoose";
import { resultType } from "../types/result.type";

const resultSchema = new mongoose.Schema<resultType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
      // required: [true, "Please enter your name!"],
      trim: true,
    },
    industry: {
      type: String,
    },
    formatted_address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    rating: {
      type: Number,
    },
    isFavorite: {
      type: Boolean,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Results", resultSchema);
