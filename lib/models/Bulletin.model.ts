import mongoose from "mongoose";

const bulletinSchema = new mongoose.Schema(
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
      trim: true,
      maxlength: [60, "Category is too long"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [5000, "Content is too long"],
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export type IBulletin = mongoose.InferSchemaType<typeof bulletinSchema> & {
  _id: mongoose.Types.ObjectId;
};

export default (mongoose.models.Bulletin as mongoose.Model<IBulletin>) ||
  mongoose.model<IBulletin>("Bulletin", bulletinSchema);
