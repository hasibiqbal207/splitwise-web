import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    groupDescription: {
      type: String,
    },
    groupCurrency: {
      type: String,
      default: "INR",
    },
    groupOwner: {
      type: String,
      required: true,
    },
    groupMembers: {
      type: Array,
      required: true,
    },
    groupCategory: {
      type: String,
      default: "Others",
    },
    groupTotal: {
      type: Number,
      default: 0,
    },
    split: {
      type: Array,
    },
  },
  {
    collection: "groups",
    timestamps: true,
  }
);

const GroupModel =
  mongoose.model.GroupModel || mongoose.model("GroupModel", groupSchema);
export default GroupModel;
