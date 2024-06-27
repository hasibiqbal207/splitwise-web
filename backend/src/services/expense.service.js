import { ExpenseModel } from "../models/index.js";

export const createExpenseinDB = async (expenseData) => {
  return await ExpenseModel.create(expenseData);
};

export const getExpenseById = async (expenseId) => {    
  return await ExpenseModel.findOne({ _id: expenseId });
}

export const deleteExpenseById = async (expenseId) => {
  return await ExpenseModel.deleteOne({ _id: expenseId });
}

export const updateExpense = async (expenseData) => {
    console.log(expenseData)
    return await ExpenseModel.updateOne({ 
        _id: expenseData.id
    }, {
        $set: {
            groupId: expenseData.groupId,
            expenseName: expenseData.expenseName,
            expenseDescription: expenseData.expenseDescription,
            expenseAmount: expenseData.expenseAmount,
            expenseOwner: expenseData.expenseOwner,
            expenseMembers: expenseData.expenseMembers,
            expensePerMember: expenseData.expenseAmount / expenseData.expenseMembers.length,
            expenseType: expenseData.expenseType,
            expenseDate: expenseData.expenseDate,
        }
    })
} 