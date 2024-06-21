import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: String,
      required: true,
    },
    expenseName: {
      type: String,
      required: true,
    },
    expenseDescription: {
      type: String,
    },
    expenseAmount: {
      type: Number,
      required: true,
    },
    expenseCategory: {
      type: String,
      default: "Others",
    },
    expenseCurrency: {
      type: String,
      default: "INR",
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
    expenseOwner: {
      type: String,
      required: true,
    },
    expenseMembers: {
      type: Array,
      required: true,
    },
    expensePerMember: {
      type: Number,
      required: true,
    },
    expenseType: {
      type: String,
      default: "Cash",
    },
  },
  {
    collection: "expenses",
    timestamps: true,
  }
);

const ExpenseModel =
  mongoose.model.ExpenseModel || mongoose.model("ExpenseModel", expenseSchema);
export default ExpenseModel;
