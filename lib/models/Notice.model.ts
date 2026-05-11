import mongoose from "mongoose";

export const STUDENT_ID_PATTERN = /^S\d{8}$/;

export const NOTICE_TYPES = [
  "Package",
  "Document",
  "Letter",
  "ARC",
  "Other",
] as const;

export const NOTICE_STATUSES = [
  "Ready",
  "Action Needed",
  "Picked Up",
] as const;

export type NoticeType = (typeof NOTICE_TYPES)[number];
export type NoticeStatus = (typeof NOTICE_STATUSES)[number];

const noticeSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, "Student ID is required"],
      uppercase: true,
      trim: true,
      index: true,
      match: [
        STUDENT_ID_PATTERN,
        "Student ID must be 'S' followed by 8 digits (e.g. S12350130).",
      ],
    },
    type: {
      type: String,
      enum: NOTICE_TYPES,
      required: [true, "Type is required"],
    },
    status: {
      type: String,
      enum: NOTICE_STATUSES,
      default: "Ready",
    },
    location: {
      type: String,
      required: [true, "Pickup location is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

export type INotice = mongoose.InferSchemaType<typeof noticeSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default (mongoose.models.Notice as mongoose.Model<INotice>) ||
  mongoose.model<INotice>("Notice", noticeSchema);
