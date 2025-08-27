import {
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  Switch,
  Typography,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useEffect, useState } from "react";
import Loading from "../Loading";
import {
  getUserDailyExpenseService,
  getUserMonthlyExpenseService,
} from "../../services/expense.service.js";
import { monthNamesMMM } from "../../utils/helper";
import useResponsive from "../../theme/hooks/useResponsive";
import AlertBanner from "../AlertBanner";

export const CalenderExpenseGraph = () => {
  const mdUp = useResponsive("up", "md");
  const [monthlyView, setMonthlyView] = useState(false);
  const [loading, setLoading] = useState(true);
  const profile = JSON.parse(localStorage.getItem("profile"));
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userMonthlyExp, setUserMonthlyExp] = useState();
  const [userDailyExp, setUserDailyExp] = useState();

  const toggleMonthlyView = () => {
    setMonthlyView(!monthlyView);
  };

  const data = {
    labels: monthlyView
      ? userDailyExp?.map(
          (daily) => monthNamesMMM[daily._id.month - 1] + "-" + daily._id.date
        )
      : userMonthlyExp?.map((monthly) => monthNamesMMM[monthly._id.month - 1]),
    datasets: [
      {
        label: monthlyView ? "Daily expense" : "Monthly expense",
        data: monthlyView
          ? userDailyExp?.map((daily) => daily.amount)
          : userMonthlyExp?.map((monthly) => monthly.amount),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        fill: true,
      },
    ],
  };

  const options = {
    tension: 0.4,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
        text: monthlyView ? "Daily expense graph" : "Monthly expense graph",
        font: { size: 18 },
        padding: 19,
        position: "bottom",
      },
      datalabels: {
        display: "true",
        formatter: (value) => {
          return value + "%";
        },
      },
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    const getUserDetails = async () => {
      setLoading(true);
      const userIdJson = {
        email: profile.email,
      };
      const response_group_monthly = await getUserMonthlyExpenseService(
        userIdJson,
        setAlert,
        setAlertMessage
      );
      setUserMonthlyExp(response_group_monthly.data.responseData);
      const response_group_daily = await getUserDailyExpenseService(
        userIdJson,
        setAlert,
        setAlertMessage
      );
      setUserDailyExp(response_group_daily.data.responseData);
      setLoading(false);
    };
    getUserDetails();
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box
          sx={{
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 5,
            ...(mdUp && { p: 5 }),
            ...(!mdUp && { p: 1 }),
          }}
        >
          <AlertBanner
            showAlert={alert}
            alertMessage={alertMessage}
            severity="error"
          />
          <Typography variant="h6">
            Expense Graph - {monthlyView ? "Daily View" : "Monthly View"}
          </Typography>

          <Box height={350} my={2}>
            <Line data={data} options={options} />
          </Box>
          <FormGroup>
            <FormControlLabel
              control={<Switch defaultChecked onClick={toggleMonthlyView} />}
              label={monthlyView ? "Daily Expense" : "Monthly Expense"}
            />
          </FormGroup>
        </Box>
      )}
    </>
  );
};
