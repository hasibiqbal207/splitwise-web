import { ExpenseModel } from "../models/index.js";
import { ExpenseDocument } from "../models/expense.model.js";
import { GroupModel, SettlementModel } from "../models/index.js";
import { GroupDocument } from "../models/group.model.js";
import { SettlementDocument } from "../models/settlement.model.js";

interface ExpenseData {
  groupId: string;
  expenseName: string;
  expenseDescription?: string;
  expenseAmount: number;
  expenseCategory: string;
  expenseCurrency: string;
  expenseDate: Date;
  expenseOwner: string;
  expenseMembers: string[];
  expensePerMember: number;
  expenseType: string;
}

// Create an expense in the database
export const createExpenseinDB = async (
  expenseData: ExpenseData
): Promise<ExpenseDocument> => {
  return await ExpenseModel.create(expenseData);
};

// Get an expense by its ID
export const getExpenseById = async (
  expenseId: string
): Promise<ExpenseDocument | null> => {
  return await ExpenseModel.findOne({ _id: expenseId });
};

// Get all expenses for a group by group ID
export const getGroupExpensesById = async (
  groupId: string
): Promise<ExpenseDocument[]> => {
  return await ExpenseModel.find({ groupId }).sort({ expenseDate: -1 });
};

// Get all expenses for a user by their email
export const getExpensesByUser = async (
  email: string
): Promise<ExpenseDocument[]> => {
  return await ExpenseModel.find({ expenseMembers: email }).sort({
    expenseDate: -1,
  });
};

// Delete an expense by its ID
export const deleteExpenseById = async (
  expenseId: string
): Promise<{ deletedCount?: number }> => {
  return await ExpenseModel.deleteOne({ _id: expenseId });
};

// Update an expense in the database
export const updateExpense = async (
  expenseData: ExpenseData & { id: string }
): Promise<ExpenseDocument | null> => {
  return await ExpenseModel.findOneAndUpdate(
    { _id: expenseData.id },
    {
      $set: {
        groupId: expenseData.groupId,
        expenseName: expenseData.expenseName,
        expenseDescription: expenseData.expenseDescription,
        expenseAmount: expenseData.expenseAmount,
        expenseOwner: expenseData.expenseOwner,
        expenseMembers: expenseData.expenseMembers,
        expensePerMember:
          expenseData.expenseAmount / expenseData.expenseMembers.length,
        expenseType: expenseData.expenseType,
        expenseDate: expenseData.expenseDate,
      },
    },
    { new: true } // This option returns the updated document
  );
};

// Get daily expenses for a user
export const getDailyExpense = async (email: string): Promise<any[]> => {
  return await ExpenseModel.aggregate([
    {
      $match: {
        expenseMembers: email,
        expenseDate: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          $lte: new Date(),
        },
      },
    },
    {
      $group: {
        _id: {
          date: { $dayOfMonth: "$expenseDate" },
          month: { $month: "$expenseDate" },
          year: { $year: "$expenseDate" },
        },
        amount: { $sum: "$expenseAmount" },
      },
    },
    { $sort: { "_id.month": 1, "_id.date": 1 } },
  ]);
};

// Get monthly expenses for a user
export const getMonthlyExpense = async (email: string): Promise<any[]> => {
  return await ExpenseModel.aggregate([
    {
      $match: { expenseMembers: email },
    },
    {
      $group: {
        _id: {
          month: { $month: "$expenseDate" },
          year: { $year: "$expenseDate" },
        },
        amount: { $sum: "$expenseAmount" },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);
};

// Get daily expenses for a group
export const getGroupDailyExpense = async (groupId: string): Promise<any[]> => {
  return await ExpenseModel.aggregate([
    {
      $match: {
        groupId,
        expenseDate: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          $lte: new Date(),
        },
      },
    },
    {
      $group: {
        _id: {
          date: { $dayOfMonth: "$expenseDate" },
          month: { $month: "$expenseDate" },
          year: { $year: "$expenseDate" },
        },
        amount: { $sum: "$expenseAmount" },
      },
    },
    { $sort: { "_id.month": 1, "_id.date": 1 } },
  ]);
};

// Get monthly expenses for a group
export const getGroupMonthlyExpense = async (
  groupId: string
): Promise<any[]> => {
  return await ExpenseModel.aggregate([
    {
      $match: { groupId },
    },
    {
      $group: {
        _id: {
          month: { $month: "$expenseDate" },
          year: { $year: "$expenseDate" },
        },
        amount: { $sum: "$expenseAmount" },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);
};

// Get expenses by category for a user
export const getUserExpenseByCategory = async (
  email: string
): Promise<any[]> => {
  return await ExpenseModel.aggregate([
    {
      $match: { expenseMembers: email },
    },
    {
      $group: {
        _id: "$expenseCategory",
        amount: { $sum: "$expensePerMember" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

// Get expenses by category for a group
export const getGroupExpenseByCategory = async (
  groupId: string
): Promise<any[]> => {
  return await ExpenseModel.aggregate([
    {
      $match: { groupId },
    },
    {
      $group: {
        _id: "$expenseCategory",
        amount: { $sum: "$expenseAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

// Get recent expenses for a user
export const getRecentExpensesByUser = async (
  email: string
): Promise<ExpenseDocument[]> => {
  return await ExpenseModel.find({ expenseMembers: email }).sort({
    $natural: -1,
  }).limit(5);
};

// Get all transactions for a user (both expenses and settlements)
export const getAllUserTransactions = async (email: string): Promise<any[]> => {
  // Get all expenses where user is a member
  const expenses = await ExpenseModel.find({ 
    expenseMembers: email 
  }).sort({ expenseDate: -1 });
  
  // Get all settlements where user is either paying or receiving
  const settlements = await SettlementModel.find({
    $or: [
      { settleTo: email },
      { settleFrom: email }
    ]
  }).sort({ settleDate: -1 });
  
  // Get group info for settlements
  const groupIds = [...new Set([
    ...expenses.map(exp => exp.groupId),
    ...settlements.map((settle: SettlementDocument) => settle.groupId)
  ])];
  
  const groups = await GroupModel.find({
    _id: { $in: groupIds }
  });
  
  const groupMap = new Map();
  groups.forEach((group: GroupDocument) => {
    if (group._id) {
      groupMap.set(group._id.toString(), {
        groupName: group.groupName,
        groupCurrency: group.groupCurrency
      });
    }
  });
  
  // Format expenses
  const formattedExpenses = expenses.map(exp => {
    const group = groupMap.get(exp.groupId);
    return {
      id: exp._id,
      type: 'expense',
      date: exp.expenseDate,
      amount: exp.expensePerMember,
      totalAmount: exp.expenseAmount,
      name: exp.expenseName,
      description: exp.expenseDescription,
      category: exp.expenseCategory,
      owner: exp.expenseOwner,
      isOwner: exp.expenseOwner === email,
      groupId: exp.groupId,
      groupName: group?.groupName || 'Unknown Group',
      groupCurrency: group?.groupCurrency || 'USD',
      timestamp: new Date(exp.expenseDate).getTime()
    };
  });
  
  // Format settlements
  const formattedSettlements = settlements.map((settle: SettlementDocument) => {
    const group = groupMap.get(settle.groupId);
    const isReceiver = settle.settleTo === email;
    return {
      id: settle._id,
      type: 'settlement',
      date: settle.settleDate,
      amount: settle.settleAmount,
      isReceiver: isReceiver,
      otherParty: isReceiver ? settle.settleFrom : settle.settleTo,
      groupId: settle.groupId,
      groupName: group?.groupName || 'Unknown Group',
      groupCurrency: group?.groupCurrency || 'USD',
      timestamp: new Date(settle.settleDate).getTime()
    };
  });
  
  // Combine and sort by date (newest first)
  return [...formattedExpenses, ...formattedSettlements]
    .sort((a, b) => b.timestamp - a.timestamp);
};