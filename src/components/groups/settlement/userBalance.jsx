import { 
  Box, 
  Grid, 
  Typography, 
  Divider, 
  Card, 
  CardContent, 
  Stack, 
  Avatar, 
  Tabs, 
  Tab, 
  Chip 
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getUserBalanceService } from "../../../services/group.service.js";
import { getAllUserTransactionsService } from "../../../services/expense.service.js";
import AlertBanner from "../../AlertBanner";
import Loading from "../../Loading";
import Iconify from "../../Iconify";
import { convertToCurrency, currencyFind, formateDate } from "../../../utils/helper";
import gravatarUrl from "gravatar-url";
import useResponsive from "../../../theme/hooks/useResponsive";
import { useParams } from "react-router-dom";

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const UserBalance = () => {
  const mdUp = useResponsive("up", "md");
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userBalances, setUserBalances] = useState([]);
  const [noBalances, setNoBalances] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [noTransactions, setNoTransactions] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [currentGroup, setCurrentGroup] = useState(null);
  
  const profile = JSON.parse(localStorage.getItem("profile"));
  const email = profile?.email;
  const params = useParams();
  const groupId = params.groupId;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const getUserData = async () => {
      setLoading(true);
      const userJson = {
        email: email
      };
      
      try {
        // Fetch balances
        const balances = await getUserBalanceService(
          userJson,
          setAlert,
          setAlertMessage
        );
        
        if (balances?.data?.data && balances.data.data.length > 0) {
          // Filter balances for current group
          const currentGroupBalance = balances.data.data.find(
            group => group.groupId === groupId
          );
          
          if (currentGroupBalance) {
            setUserBalances([currentGroupBalance]);
            setCurrentGroup(currentGroupBalance);
            setNoBalances(false);
          }
        }
        
        // Fetch transaction history
        const transactionData = await getAllUserTransactionsService(
          userJson,
          setAlert,
          setAlertMessage
        );
        
        if (transactionData?.data?.transactions && transactionData.data.transactions.length > 0) {
          // Filter transactions for current group
          const groupTransactions = transactionData.data.transactions.filter(
            transaction => transaction.groupId === groupId
          );
          
          if (groupTransactions.length > 0) {
            setTransactions(groupTransactions);
            setNoTransactions(false);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAlert(true);
        setAlertMessage("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    
    getUserData();
  }, [email, groupId]);

  const renderTransactionIcon = (transaction) => {
    if (transaction.type === 'expense') {
      if (transaction.isOwner) {
        return (
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
            }}
          >
            <Iconify icon="mdi:receipt-text" />
          </Avatar>
        );
      } else {
        return (
          <Avatar
            sx={{
              bgcolor: 'error.main',
              width: 40,
              height: 40,
            }}
          >
            <Iconify icon="mdi:cash-minus" />
          </Avatar>
        );
      }
    } else { // settlement
      if (transaction.isReceiver) {
        return (
          <Avatar
            sx={{
              bgcolor: 'success.main',
              width: 40,
              height: 40,
            }}
          >
            <Iconify icon="mdi:cash-plus" />
          </Avatar>
        );
      } else {
        return (
          <Avatar
            sx={{
              bgcolor: 'warning.main',
              width: 40,
              height: 40,
            }}
          >
            <Iconify icon="mdi:cash-send" />
          </Avatar>
        );
      }
    }
  };

  const getTransactionDescription = (transaction) => {
    if (transaction.type === 'expense') {
      if (transaction.isOwner) {
        return `You added "${transaction.name}" expense`;
      } else {
        return `${transaction.owner} added "${transaction.name}" expense`;
      }
    } else { // settlement
      if (transaction.isReceiver) {
        return `${transaction.otherParty} paid you`;
      } else {
        return `You paid ${transaction.otherParty}`;
      }
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Box sx={{ width: '100%', pb: 3 }}>
          <AlertBanner
            showAlert={alert}
            alertMessage={alertMessage}
            severity="error"
          />
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="user balance tabs"
              variant="fullWidth"
            >
              <Tab label="Outstanding Balances" />
              <Tab label="Transaction History" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            {noBalances ? (
              <Grid
                container
                direction="column"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  minHeight: "200px",
                }}
              >
                <Iconify
                  icon="icon-park-twotone:doc-success"
                  sx={{
                    color: (theme) => theme.palette["success"].dark,
                    fontSize: 100,
                  }}
                />
                <Typography fontSize={18} textAlign={"center"} my={1}>
                  You're all settled up in this group!
                </Typography>
              </Grid>
            ) : (
              <Grid container spacing={2}>
                {userBalances.map((group, groupIndex) => (
                  <Grid item xs={12} key={`group-${groupIndex}`}>
                    <Card 
                      elevation={2}
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        overflow: "hidden"
                      }}
                    >
                      <CardContent>
                        <Grid container spacing={2}>
                          {group.transactions.map((transaction, index) => {
                            // Check if the current user is the one who owes
                            const isOwer = transaction[0] === email;
                            const otherPerson = isOwer ? transaction[1] : transaction[0];
                            const amount = transaction[2];
                            
                            return (
                              <Grid item xs={12} md={6} key={`transaction-${index}`}>
                                <Card 
                                  elevation={1}
                                  sx={{ 
                                    p: 2,
                                    bgcolor: isOwer 
                                      ? (theme) => theme.palette["error"].lighter 
                                      : (theme) => theme.palette["success"].lighter,
                                    color: isOwer
                                      ? (theme) => theme.palette["error"].darker
                                      : (theme) => theme.palette["success"].darker
                                  }}
                                >
                                  <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar
                                      alt={otherPerson}
                                      src={gravatarUrl(otherPerson, { size: 60 })}
                                      sx={{
                                        width: 40,
                                        height: 40,
                                      }}
                                    />
                                    <Box>
                                      <Typography variant="body2">
                                        {isOwer ? 'You owe' : 'You are owed by'}
                                      </Typography>
                                      <Typography variant="body1" fontWeight="bold">
                                        {otherPerson}
                                      </Typography>
                                    </Box>
                                    <Box ml="auto">
                                      <Typography variant="h6" fontWeight="bold">
                                        {currencyFind(group.groupCurrency)} {convertToCurrency(amount)}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Card>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            {noTransactions ? (
              <Grid
                container
                direction="column"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  minHeight: "200px",
                }}
              >
                <Iconify
                  icon="ph:receipt"
                  sx={{
                    color: (theme) => theme.palette["info"].dark,
                    fontSize: 100,
                  }}
                />
                <Typography fontSize={18} textAlign={"center"} my={1}>
                  No transaction history found for this group
                </Typography>
              </Grid>
            ) : (
              <Box>
                {transactions.map((transaction, index) => (
                  <Card
                    key={`transaction-${index}`}
                    elevation={1}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      {renderTransactionIcon(transaction)}
                      <Box flex={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1" fontWeight="medium">
                            {getTransactionDescription(transaction)}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            fontWeight="bold" 
                            color={
                              transaction.type === 'expense' 
                                ? (transaction.isOwner ? 'primary.main' : 'error.main')
                                : (transaction.isReceiver ? 'success.main' : 'warning.main')
                            }
                          >
                            {transaction.isReceiver || (transaction.type === 'expense' && !transaction.isOwner) ? '+' : '-'}
                            {currencyFind(transaction.groupCurrency)} {convertToCurrency(transaction.amount)}
                          </Typography>
                        </Stack>
                        <Stack 
                          direction={mdUp ? "row" : "column"} 
                          justifyContent="space-between"
                          mt={0.5}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {formateDate(transaction.date)}
                          </Typography>
                          <Box>
                            {transaction.type === 'expense' && transaction.category && (
                              <Chip 
                                label={transaction.category} 
                                size="small" 
                                color="secondary" 
                                variant="outlined"
                                sx={{ ml: mdUp ? 1 : 0, mt: mdUp ? 0 : 1 }}
                              />
                            )}
                          </Box>
                        </Stack>
                      </Box>
                    </Stack>
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>
        </Box>
      )}
    </>
  );
};

export default UserBalance; 