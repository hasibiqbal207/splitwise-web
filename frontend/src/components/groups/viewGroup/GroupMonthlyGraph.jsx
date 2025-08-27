import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getGroupDailyExpenseService,
  getGroupMonthlyExpenseService,
} from "../../../services/expense.service.js";
import AlertBanner from "../../AlertBanner";
import Loading from "../../Loading";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { monthNamesMMM } from "../../../utils/helper";

const GroupMonthlyGraph = () => {
  const params = useParams();
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState();
  const [loading, setLoading] = useState(true);
  const [monthlyExp, setMonthlyExp] = useState();
  const [dailyExp, setDailyExp] = useState();
  const [monthlyView, setMonthlyView] = useState(false);

  const toggleMonthlyView = () => {
    setMonthlyView(!monthlyView);
  };

  const data = {
    labels: monthlyView
      ? monthlyExp?.map((monthly) => monthNamesMMM[monthly._id.month - 1])
      : dailyExp?.map(
          (daily) => monthNamesMMM[daily._id.month - 1] + "-" + daily._id.date
        ),
    datasets: [
      {
        label: "Monthly Expenses",
        data: monthlyView
          ? monthlyExp?.map((monthly) => monthly.amount)
          : dailyExp?.map((daily) => daily.amount),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderColor: "rgba(54, 162, 235, 1)",
        fill: true,
      },
    ],
  };

  const options = {
    tension: 0.2,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
        text: "Monthly expense graph",
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
    const getGroupMonthlyExpense = async () => {
      setLoading(true);
      const groupIdJson = {
        groupId: params.groupId,
      };
      const monthly_exp = await getGroupMonthlyExpenseService(
        groupIdJson,
        setAlert,
        setAlertMessage
      );
      const daily_exp = await getGroupDailyExpenseService(
        groupIdJson,
        setAlert,
        setAlertMessage
      );
      setMonthlyExp(monthly_exp.data.responseData);
      setDailyExp(daily_exp.data.responseData);
      setLoading(false);
    };
    getGroupMonthlyExpense();
  }, []);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Box height={350} mb={5}>
            <AlertBanner
              showAlert={alert}
              alertMessage={alertMessage}
              severity="error"
            />

            <Line data={data} options={options} />
            <FormGroup>
              <FormControlLabel
                control={<Switch defaultChecked onClick={toggleMonthlyView} />}
                label="Daily view"
              />
            </FormGroup>
          </Box>
          <Typography variant="subtitle">
            <center>
              {monthlyView ? (
                <>Monthly expense graph</>
              ) : (
                <>Daily expense graph</>
              )}{" "}
            </center>
          </Typography>
        </>
      )}
    </>
  );
};

export default GroupMonthlyGraph;
