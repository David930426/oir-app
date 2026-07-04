import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [200, "Name is too long"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["International", "Nationality", "Social", "Hobby"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description is too long"],
    },
    socialLinks: {
      line: { type: String, trim: true, maxlength: [500, "Link is too long"] },
      instagram: {
        type: String,
        trim: true,
        maxlength: [500, "Link is too long"],
      },
      facebook: {
        type: String,
        trim: true,
        maxlength: [500, "Link is too long"],
      },
    },
    upcomingEvents: {
      type: [String],
      default: [],
    },
    membersCount: {
      type: Number,
      required: [true, "Members count is required"],
      min: [0, "Members count can't be negative"],
      default: 0,
    },
  },
  { timestamps: true },
);

export type IOrganization = mongoose.InferSchemaType<
  typeof organizationSchema
> & {
  _id: mongoose.Types.ObjectId;
};

export default (mongoose.models.Organization as mongoose.Model<IOrganization>) ||
  mongoose.model<IOrganization>("Organization", organizationSchema);
