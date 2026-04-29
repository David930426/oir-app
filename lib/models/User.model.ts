import mongoose from "mongoose";

// 1. Update the TypeScript Interface
// export interface IUser extends Document {
//   email: string;
//   password: string;
//   role: "student" | "admin";
//   rememberMe: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// 2. Update the Mongoose Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      index: true,
    },
    batchId: {
      type: String,
      required: [true, "StudentId is required"],
      unique: true,
    },
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
      enum: ["student", "admin"],
      default: "student",
    },
  },
  {
    timestamps: true,
  },
);

export type IUser = mongoose.InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

export default (mongoose.models.User as mongoose.Model<IUser>) ||
    mongoose.model<IUser>("User", userSchema);
