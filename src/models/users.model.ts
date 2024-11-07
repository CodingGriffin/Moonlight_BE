import mongoose from "mongoose";
import { userType } from "../types/user.type";

const userSchema = new mongoose.Schema<userType>(
  {
    googleId: {
      type: String,
      required: [true, "Please enter your name!"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please enter your name!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email!"],
      trim: true,
      unique: true,
    },
    token: {
      type: String,
      required: [true, "Please enter your token!"],
    },
    password: {
      type: String,
      // required: [true, "Please enter your password!"],
    },
    role: {
      type: Number,
      default: 0, // 0 = user, 1 = admin
    },
    picture: {
      type: String,
      default:
        "https://res.cloudinary.com/congly2810/image/upload/v1664118040/avatar/tutcbepph8ezeb0aym1q.png",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Users", userSchema);
