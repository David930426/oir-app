import mongoose from "mongoose";

const bulletinCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: [60, "Category name is too long"],
    },
  },
  { timestamps: true },
);

export type IBulletinCategory = mongoose.InferSchemaType<
  typeof bulletinCategorySchema
> & {
  _id: mongoose.Types.ObjectId;
};

export default (mongoose.models.BulletinCategory as mongoose.Model<IBulletinCategory>) ||
  mongoose.model<IBulletinCategory>("BulletinCategory", bulletinCategorySchema);
