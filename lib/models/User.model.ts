import { Schema, Document, model, models } from "mongoose";

// 1. Update the TypeScript Interface
export interface IUser extends Document {
  email: string;
  password: string;
  role: "student" | "staff" | "admin";
  rememberToken?: string; // Optional string to store the session token
  createdAt: Date;
  updatedAt: Date;
}

// 2. Update the Mongoose Schema
const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, 
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, 
    },
    role: {
      type: String,
      enum: ["student", "staff", "admin"],
      default: "student",
    },
    // Add the new field here
    rememberToken: {
      type: String,
      default: null,
      select: false, // Security: Keep it hidden from general queries
    },
  },
  {
    timestamps: true, 
  }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;