import mongoose, { Schema } from "mongoose";
import { emailType } from "../types/email.type";

const emailSchema = new mongoose.Schema<emailType>(
  {
    userID: {
      type: Schema.Types.ObjectId,
    },
    recipient: {
			type: String,
			required: true,
    },
    subject: {
			type: String,
			required: true,
    },
    message: {
			type: String,
			required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Emails", emailSchema);
