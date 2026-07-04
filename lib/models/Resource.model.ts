import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title is too long"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Essential", "Guideline", "Form", "Other"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description is too long"],
    },
    fileType: {
      type: String,
      required: [true, "File type is required"],
      enum: ["PDF", "Link", "Doc"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      maxlength: [2000, "URL is too long"],
    },
  },
  { timestamps: true },
);

export type IResource = mongoose.InferSchemaType<typeof resourceSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default (mongoose.models.Resource as mongoose.Model<IResource>) ||
  mongoose.model<IResource>("Resource", resourceSchema);
