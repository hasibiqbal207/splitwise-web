import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { getRecentUserExpenseService } from "../../services/expense.service.js";
import AlertBanner from "../AlertBanner";
import ExpenseCard from "../expense/ExpenseCard";
import Loading from "../Loading";

export const RecentTransactions = () => {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [recentExp, setRecentExp] = useState();
  const profile = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    const getRecentExp = async () => {
      setLoading(true);
      const userIdJson = {
        email: profile.email,
      };
      const recent_exp = await getRecentUserExpenseService(
        userIdJson,
        setAlert,
        setAlertMessage
      );
      // console.log(recent_exp?.data?.expenses);
      recent_exp && setRecentExp(recent_exp?.data?.expenses);
      setLoading(false);
    };
    getRecentExp();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            boxShadow: 5,
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 1,
          }}
        >
          <AlertBanner
            showAlert={alert}
            alertMessage={alertMessage}
            severity="error"
          />
          <Typography
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              typography: "h6", 
              p: 2,
            }}
          >
            Your Recent Transactions
          </Typography>

          {recentExp?.map((myExpense) => (
            <ExpenseCard
              key={myExpense?._id}
              expenseId={myExpense?._id}
              expenseName={myExpense?.expenseName}
              expenseAmount={myExpense?.expenseAmount}
              expensePerMember={myExpense?.expensePerMember}
              expenseOwner={myExpense?.expenseOwner}
              expenseDate={myExpense?.expenseDate}
              currencyType={myExpense?.expenseCurrency}
            />
          ))}
        </Box>
      )}
    </>
  );
};
