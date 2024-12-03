import mongoose, { Schema } from "mongoose";
import { sheetType } from "../types/sheet.type";

const sheetSchema = new mongoose.Schema<sheetType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
    },
    name: {
      type: String,
      // required: [true, "Please enter your name!"],
      trim: true,
    },
    results: {
      type: [Array]
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Sheets", sheetSchema);
