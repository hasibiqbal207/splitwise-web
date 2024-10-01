import { ExpenseModel } from "../models/index.js";

export const createExpenseinDB = async (expenseData) => {
  return await ExpenseModel.create(expenseData);
};

export const getExpenseById = async (expenseId) => {
  return await ExpenseModel.findOne({ _id: expenseId });
};

export const getGroupExpensesById = async (groupId) => {
  return await ExpenseModel.find({ groupId: groupId }).sort({
    expenseDate: -1,
  });
};

export const getExpensesByUser = async (userEmail) =>
  await ExpenseModel.find({ expenseMembers: userEmail }).sort({
    expenseDate: -1,
  });

export const deleteExpenseById = async (expenseId) => {
  return await ExpenseModel.deleteOne({ _id: expenseId });
};

export const updateExpense = async (expenseData) => {
  return await ExpenseModel.updateOne(
    {
      _id: expenseData.id,
    },
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
    }
  );
};

export const getDailyExpense = async (userEmail) => {
  return await ExpenseModel.aggregate([
    {
      $match: {
        expenseMembers: userEmail,
        expenseDate: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          $lte: new Date(),
        },
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dayOfMonth: "$expenseDate",
          },
          month: {
            $month: "$expenseDate",
          },
          year: {
            $year: "$expenseDate",
          },
        },
        amount: {
          $sum: "$expenseAmount",
        },
      },
    },
    { $sort: { "_id.month": 1, "_id.date": 1 } },
  ]);
};

export const getMonthlyExpense = async (userEmail) => {
  return await ExpenseModel.aggregate([
    {
      $match: {
        expenseMembers: userEmail,
      },
    },
    {
      $group: {
        _id: {
          month: {
            $month: "$expenseDate",
          },
          year: {
            $year: "$expenseDate",
          },
        },
        amount: {
          $sum: "$expenseAmount",
        },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);
};

export const getGroupDailyExpense = async (groupId) => {
  return await ExpenseModel.aggregate([
    {
      $match: {
        groupId: groupId,
        expenseDate: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          $lte: new Date(),
        },
      },
    },
    {
      $group: {
        _id: {
          date: {
            $dayOfMonth: "$expenseDate",
          },
          month: {
            $month: "$expenseDate",
          },
          year: {
            $year: "$expenseDate",
          },
        },
        amount: {
          $sum: "$expenseAmount",
        },
      },
    },
    { $sort: { "_id.month": 1, "_id.date": 1 } },
  ]);
};

export const getGroupMonthlyExpense = async (groupId) => {
  return await ExpenseModel.aggregate([
    {
      $match: {
        groupId: groupId,
      },
    },
    {
      $group: {
        _id: {
          month: {
            $month: "$expenseDate",
          },
          year: {
            $year: "$expenseDate",
          },
        },
        amount: {
          $sum: "$expenseAmount",
        },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);
};

export const getUserExpenseByCategory = async (userEmail) => {
  return await ExpenseModel.aggregate([
    {
      $match: {
        expenseMembers: userEmail,
      },
    },
    {
      $group: {
        _id: "$expenseCategory",
        amount: {
          $sum: "$expensePerMember",
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getGroupExpenseByCategory = async (groupId) => {
  return await ExpenseModel.aggregate([
    {
      $match: {
        groupId: groupId,
      },
    },
    {
      $group: {
        _id: "$expenseCategory",
        amount: {
          $sum: "$expenseAmount",
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

export const getRecentExpensesByUser = async (userEmail) => {
  return await ExpenseModel.find({ expenseMembers: userEmail }).sort({
    expenseDate: -1,
  });
};