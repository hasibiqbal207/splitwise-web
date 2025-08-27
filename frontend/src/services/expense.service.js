import * as api from "../api/index";

export const addExpenseService = async (data, setAlert, setAlertMessage) => {
  try {
    const add_exp_response = await api.addExpense(data);
    return add_exp_response;
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const editExpenseService = async (data, setAlert, setAlertMessage) => {
  try {
    const edit_exp_response = await api.editExpense(data);
    return edit_exp_response;
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const getExpenseDetailsService = async (
  data,
  setAlert,
  setAlertMessage
) => {
  try {
    return await api.getExpenseDetails(data);
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const deleteExpenseService = async (data, setAlert, setAlertMessage) => {
  try {
    const delete_exp_response = await api.deleteExpense(data);
    return delete_exp_response;
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const getUserExpenseService = async (
  data,
  setAlert,
  setAlertMessage
) => {
  try {
    const expense_details = await api.getUserExpense(data);
    return expense_details;
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const getRecentUserExpenseService = async (
  data,
  setAlert,
  setAlertMessage
) => {
  try {
    return await api.getRecentUserExpense(data);
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const getUserDailyExpenseService = async (
  data,
  setAlert,
  setAlertMessage
) => {
  try {
    return await api.getUserDailyExpense(data);
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const getUserMonthlyExpenseService = async (
  data,
  setAlert,
  setAlertMessage
) => {
  try {
    return await api.getUserMonthlyExpense(data);
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const getUserCategoryExpenseService = async (
  data,
  setAlert,
  setAlertMessage
) => {
  try {
    return await api.getUserCategoryExpense(data);
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const getAllUserTransactionsService = async (
  data,
  setAlert,
  setAlertMessage
) => {
  try {
    return await api.getAllUserTransactions(data);
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went wrong");
    return false;
  }
};

export const getGroupExpenseService = async (
  data,
  setAlert,
  setAlertMessage
) => {
  try {
    const expense_details = await api.getGroupExpense(data);
    return expense_details;
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const getGroupDailyExpenseService = async (
  data,
  setAlert,
  setAlertMessage
) => {
  try {
    return await api.getGroupDailyExpense(data);
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const getGroupMonthlyExpenseService = async (
  data,
  setAlert,
  setAlertMessage
) => {
  try {
    return await api.getGroupMonthlyExpense(data);
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};

export const getGroupCategoryExpenseService = async (
  data,
  setAlert,
  setAlertMessage
) => {
  try {
    return await api.getGroupCategoryExpense(data);
  } catch (err) {
    setAlert(true);
    err.response.status === 400 || err.response.status === 401
      ? setAlertMessage(err.response.data.message)
      : setAlertMessage("Oops! Something went worng");
    return false;
  }
};
