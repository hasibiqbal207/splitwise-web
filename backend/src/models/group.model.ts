import mongoose, { Document, Model } from "mongoose";

interface IGroup {
  groupName: string;
  groupDescription?: string;
  groupCurrency: string;
  groupOwner: string;
  groupMembers: string[];
  groupCategory: string;
  groupTotal: number;
  split: Record<string, number>[]; 
}

export interface GroupDocument extends IGroup, Document {}

const groupSchema = new mongoose.Schema<GroupDocument>(
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
      default: "EUR",
    },
    groupOwner: {
      type: String,
      required: true,
    },
    groupMembers: {
      type: [String],
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
      type: [
        {
          user: { type: String, required: true },
          amount: { type: Number, required: true }
        }
      ],
    },
  },
  {
    collection: "groups",
    timestamps: true,
  }
);

const GroupModel: Model<GroupDocument> =
  mongoose.models.GroupModel ||
  mongoose.model<GroupDocument>("GroupModel", groupSchema);
export default GroupModel;
