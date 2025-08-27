import mongoose, {Document, Model} from "mongoose";

interface ISettlement {
  groupId: string;
  settleTo: string;
  settleFrom: string;
  settleDate: string;
  settleAmount: number;
}

export interface SettlementDocument extends ISettlement, Document {}

const settlementSchema = new mongoose.Schema<SettlementDocument>(
  {
    groupId: {
      type: String,
      required: true,
    },
    settleTo: {
      type: String,
      required: true,
    },
    settleFrom: {
      type: String,
      required: true,
    },
    settleDate: {
      type: String,
      required: true,
    },
    settleAmount: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "settlements",
    timestamps: true,
  }
);

const SettlementModel: Model<SettlementDocument> =
  mongoose.models.SettlementModel ||
  mongoose.model<SettlementDocument>("SettlementModel", settlementSchema);

export default SettlementModel;
