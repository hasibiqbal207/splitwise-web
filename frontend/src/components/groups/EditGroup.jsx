import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { getEmailList } from "../../services/authentication.service.js";
import Loading from "../Loading";
import useResponsive from "../../theme/hooks/useResponsive";
import {
  editGroupService,
  getGroupDetailsService,
  deleteGroupService,
} from "../../services/group.service.js";
import AlertBanner from "../AlertBanner";
import configData from "../../config/config.json";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

export const EditGroup = () => {
  const navigate = useNavigate();
  const params = useParams();
  const mdUp = useResponsive("up", "md");
  const profile = JSON.parse(localStorage.getItem("profile"));
  const currentUser = profile?.email;
  const [loading, setLoading] = useState(false);
  const [emailList, setEmailList] = useState([]);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const groupSchema = Yup.object().shape({
    groupName: Yup.string().required("Group name is required"),
    groupDescription: Yup.string(),
    groupCurrency: Yup.string().required("Currency Type is required"),
    groupCategory: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      groupName: "",
      groupDescription: "",
      groupCurrency: "",
      groupCategory: "",
      groupOwner: "",
      groupMembers: [currentUser],
      id: params.groupId,
    },
    validationSchema: groupSchema,
    onSubmit: async () => {
      const create_response = await editGroupService(
        values,
        setAlert,
        setAlertMessage
      );
      create_response &&
        (window.location = configData.VIEW_GROUP_URL + params.groupId);
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps, setFieldValue } =
    formik;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
    const getEmails = async () => {
      setLoading(true);

      try {
        const response = await getEmailList();

        if (response.data.status === "Success") {
          let list = response.data.users;

          // Remove currentUser based on the email
          const filteredList = list.filter(
            (user) => user.email !== currentUser
          );

          setEmailList(filteredList);
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        const groupIdJson = {
          groupId: params.groupId,
        };
        const response_group = await getGroupDetailsService(
          groupIdJson,
          setAlert,
          setAlertMessage
        );
        const groupDetails = response_group?.data?.groupData;
        setFieldValue('groupName', groupDetails?.groupName);
        setFieldValue('groupDescription', groupDetails?.groupDescription);
        setFieldValue('groupMembers', groupDetails?.groupMembers || []); // Ensure it's an array
        setFieldValue('groupOwner', groupDetails?.groupOwner);
        setFieldValue('groupCurrency', groupDetails?.groupCurrency);
        setFieldValue('groupCategory', groupDetails?.groupCategory);

        setLoading(false);
      }
    };
    getEmails();
  }, []);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const groupIdJson = {
        groupId: params.groupId,
      };

      const response = await deleteGroupService(
        groupIdJson,
        setAlert,
        setAlertMessage
      );
      if (response.data.status === "Success") {
        setAlert(true);
        setAlertMessage("Group deleted successfully");
        // Navigate to groups list or dashboard after successful deletion
        navigate('/dashboard');
      } else {
        setAlert(true);
        setAlertMessage(response.data.message || "Failed to delete group");
      }
    } catch (error) {
      setAlert(true);
      setAlertMessage("An error occurred while deleting the group");
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Typography variant="h4" pb={2} mb={3}>
            Edit Group
          </Typography>
          <AlertBanner
            showAlert={alert}
            alertMessage={alertMessage}
            severity="error"
          />
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Grid container spacing={3} sx={{ maxWidth: 800 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="text"
                    name="groupName"
                    id="outlined-basic"
                    label="Group Name"
                    variant="outlined"
                    {...getFieldProps("groupName")}
                    error={Boolean(touched.groupName && errors.groupName)}
                    helperText={touched.groupName && errors.groupName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    name="groupDescription"
                    id="outlined-basic"
                    label="Group Description"
                    variant="outlined"
                    {...getFieldProps("groupDescription")}
                    error={Boolean(
                      touched.groupDescription && errors.groupDescription
                    )}
                    helperText={
                      touched.groupDescription && errors.groupDescription
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel id="group-members-label">
                      Group Members
                    </InputLabel>
                    <Select
                      labelId="group-members-label"
                      id="group-members"
                      multiple
                      value={values.groupMembers}
                      onChange={(event) => setFieldValue('groupMembers', event.target.value)}
                      input={
                        <OutlinedInput
                          id="group-members"
                          label="Group Members"
                        />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {emailList.map((user, index) => (
                        <MenuItem key={uuidv4()} value={user.email}>
                          {user.name} - <Typography sx={{ color: "gray" }}>[{user.email}] </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    error={Boolean(
                      touched.groupCurrency && errors.groupCurrency
                    )}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Currency
                    </InputLabel>
                    <Select
                      name="groupCurrency"
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Currency"
                      {...getFieldProps("groupCurrency")}
                    >
                      <MenuItem value={"EUR"}>€ EUR</MenuItem>
                      <MenuItem value={"USD"}>$ USD</MenuItem>
                      <MenuItem value={"BDT"}>৳ BDT</MenuItem>
                    </Select>
                    <FormHelperText>
                      {touched.groupCurrency && errors.groupCurrency}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl
                    fullWidth
                    error={Boolean(
                      touched.groupCategory && errors.groupCategory
                    )}
                  >
                    <InputLabel id="group-category">Category</InputLabel>
                    <Select
                      name="groupCategory"
                      labelId="group-category"
                      id="demo-simple-select"
                      label="Category"
                      {...getFieldProps("groupCategory")}
                    >
                      <MenuItem value={"Home"}>Home</MenuItem>
                      <MenuItem value={"Trip"}>Trip</MenuItem>
                      <MenuItem value={"Office"}>Office</MenuItem>
                      <MenuItem value={"Sports"}>Sports</MenuItem>
                      <MenuItem value={"Others"}>Others</MenuItem>
                    </Select>
                    <FormHelperText>
                      {touched.groupCategory && errors.groupCategory}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                {mdUp && <Grid item xs={0} md={3} />}
                <Grid item xs={6} md={3}>
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                </Grid>
                <Grid item xs={6} md={3}>
                  <LoadingButton
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Edit Group
                  </LoadingButton>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Button
                    fullWidth
                    size="large"
                    variant="outlined"
                    color="error"
                    onClick={handleDeleteClick}
                  >
                    Delete Group
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>

          {/* Delete Confirmation Dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Delete Group"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this group? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};
