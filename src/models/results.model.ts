import mongoose from "mongoose";
import { resultType } from "../types/result.type";

const resultSchema = new mongoose.Schema<resultType>(
  {
    // userId: {
    //   type: mongoose.Types.ObjectId,
    // },
    name: {
      type: String,
      // required: [true, "Please enter your name!"],
      trim: true,
    },
    industry: {
      type: String,
    },
    country: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    website: {
      type: String,
    },
    googleReviewRating: {
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
