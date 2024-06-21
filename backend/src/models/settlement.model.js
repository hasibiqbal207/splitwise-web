import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
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

const SettlementModel =
  mongoose.model.SettlementModel ||
  mongoose.model("SettlementModel", settlementSchema);
export default SettlementModel;
