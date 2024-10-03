import mongoose, { Document, Model } from "mongoose";

enum Currency {
  EUR = "EUR",
  USD = "USD",
}

enum ExpenseType {
  Cash = "Cash",
  Card = "Card",
}

interface IExpense {
  groupId: string;
  expenseName: string;
  expenseDescription?: string;
  expenseAmount: number;
  expenseCategory?: string; 
  expenseCurrency?: Currency;
  expenseDate: Date;
  expenseOwner: string;
  expenseMembers: string[];
  expensePerMember: number;
  expenseType?: ExpenseType; 
}

export interface ExpenseDocument extends IExpense, Document {}

const expenseSchema = new mongoose.Schema<ExpenseDocument>(
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
      enum: Object.values(Currency), 
      default: Currency.EUR,
    },
    expenseDate: {
      type: Date,
      default: Date.now, // `Date.now` returns a timestamp, Mongoose will convert it to Date
    },
    expenseOwner: {
      type: String,
      required: true,
    },
    expenseMembers: {
      type: [String], // Correctly typed as an array of strings
      required: true,
    },
    expensePerMember: {
      type: Number,
      required: true,
    },
    expenseType: {
      type: String,
      enum: Object.values(ExpenseType), // Use enum validation in the schema
      default: ExpenseType.Cash, // Default to Cash
    },
  },
  {
    collection: "expenses",
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const ExpenseModel: Model<ExpenseDocument> =
  mongoose.models.ExpenseModel || mongoose.model<ExpenseDocument>("ExpenseModel", expenseSchema);

export default ExpenseModel;
