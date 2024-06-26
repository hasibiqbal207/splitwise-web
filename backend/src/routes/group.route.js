import express from "express";

import {
  createGroup,
  viewGroup,
  editGroup,
  deleteGroup,
  findGroupsbyUser
//   findGroup,
//   splitNewExpense,
//   clearLastSplit,
//   initiateSettlement
} from "../controllers/group.controller.js";

const router = express.Router();

router.route("/createGroup").post(createGroup);
router.route("/viewGroup").get(viewGroup);
router.route("/editGroup").put(editGroup);
router.route("/deleteGroup").delete(deleteGroup);

router.route("/getUserGroups").get(findGroupsbyUser);

// router.route("/splitNewExpense").get(splitNewExpense);
// router.route("/clearLastSplit").get(clearLastSplit);
// router.route("/initiateSettlement").get(initiateSettlement);
// router.route("/splitExpense").get(viewGroup);

export default router;
