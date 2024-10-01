import { GroupModel, SettlementModel } from "../models/index.js";

export const createGroupinDB = async (groupData) => {
  return await GroupModel.create(groupData);
};

export const findGroupByID = async (groupId) => {
  return await GroupModel.findOne({ _id: groupId });
};

export const updateGroupinDB = async (groupData) => {
  return await GroupModel.updateOne(
    {
      _id: groupData.id,
    },
    {
      $set: {
        groupName: groupData.groupName,
        groupDescription: groupData.groupDescription,
        groupCurrency: groupData.groupCurrency,
        groupMembers: groupData.groupMembers,
        groupCategory: groupData.groupCategory,
        split: groupData.split,
      },
    }
  );
};

export const deleteGroupinDB = async (groupId) => {
  return await GroupModel.deleteOne({ _id: groupId });
};

export const getUserGroups = async (email) => {
  return await GroupModel.find({ groupMembers: email }).sort({
    $natural: -1, //to get the newest first
  });
};

export const getGroupUsers = async (groupId) => {
  return await GroupModel.findOne(
    { _id: groupId },
    {
      groupMembers: 1,
      _id: 0,
    }
  );
};

export const updateGroupSplit = async (groupId, split) => {
  return GroupModel.updateOne({ _id: groupId }, { $set: { split } });
};

export const createSettlement = async (settlementData) => {
  return SettlementModel.create(settlementData);
};