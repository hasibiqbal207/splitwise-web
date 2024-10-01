import express from "express";

import {
  createGroup,
  viewGroup,
  editGroup,
  deleteGroup,
  findGroupsbyUser,
  makeSettlement,
  groupBalanceSheet
//   findGroup,
//   splitNewExpense,
//   clearLastSplit,
//   initiateSettlement
} from "../controllers/group.controller.js";


const router = express.Router();

router.route("/createGroup").post(createGroup);
router.route("/viewGroup").post(viewGroup);
router.route("/editGroup").put(editGroup);
router.route("/deleteGroup").delete(deleteGroup);

router.route("/getUserGroups").post(findGroupsbyUser);

// Rename needed
router.route("/makeSettlement").post(makeSettlement);

// Rename needed
router.route("/groupSettlement").post(groupBalanceSheet);


// //Settlement Calculator router 
// router.post('/settlement', controller.groupBalanceSheet)

// //Make settlement router 
// router.post('/makeSettlement', controller.makeSettlement)


export default router;

