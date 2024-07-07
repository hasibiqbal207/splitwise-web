import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_BACKEND_BASE_URL });

const getAuthHeader = () => {
  const profile = JSON.parse(localStorage.getItem("profile"));
  return {
    headers: {
      Authorization: `token ${profile ? profile.accessToken : ""}`,
    },
  };
};

export const addExpense = (payload) =>
  API.post("/expense/addExpense", payload, getAuthHeader());
export const editExpense = (payload) =>
  API.put("/expense/editExpense", payload, getAuthHeader());
export const getExpenseDetails = (payload) =>
  API.post("/expense/viewExpense", payload, getAuthHeader());
export const deleteExpense = (payload) =>
  API.delete("/expense/deleteExpense", { ...getAuthHeader(), data: payload });

export const getUserExpense = (payload) =>
  API.post("/expense/user", payload, getAuthHeader());
export const getRecentUserExpense = (payload) =>
  API.post("/expense/user/recentExpenses", payload, getAuthHeader());
export const getUserDailyExpense = (payload) =>
  API.post("/expense/user/dailyExpense", payload, getAuthHeader());
export const getUserMonthlyExpense = (payload) =>
  API.post("/expense/user/monthlyExpense", payload, getAuthHeader());
export const getUserCategoryExpense = (payload) =>
  API.post("/expense/user/expenseByCategory", payload, getAuthHeader());

export const getGroupExpense = (payload) =>
  API.post("/expense/group", payload, getAuthHeader());
export const getGroupDailyExpense = (payload) =>
  API.post("/expense/group/dailyExpense", payload, getAuthHeader());
export const getGroupMonthlyExpense = (payload) =>
  API.post("/expense/group/monthlyExpense", payload, getAuthHeader());
export const getGroupCategoryExpense = (payload) =>
  API.post("/expense/group/expenseByCategory", payload, getAuthHeader());
