import express from "express";

import {
  createGroup,
  viewGroup,
  editGroup,
  deleteGroup,
  findGroupsbyUser,
  makeSettlement,
  groupBalanceSheet,
  userBalanceSheet,
} from "../controllers/group.controller.js";

const router = express.Router();

router.route("/createGroup").post(createGroup);

router.route("/viewGroup").post(viewGroup);

router.route("/editGroup").put(editGroup);

router.route("/deleteGroup").delete(deleteGroup);

router.route("/getUserGroups").post(findGroupsbyUser);

router.route("/makeSettlement").post(makeSettlement);

router.route("/groupSettlement").post(groupBalanceSheet);

router.route("/userBalance").post(userBalanceSheet);

export default router;
