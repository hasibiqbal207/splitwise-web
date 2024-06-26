import { GroupModel } from "../models/index.js";

export const createGroupinDB = async (groupData) => {
  return await GroupModel.create(groupData);
};

export const findGroupinDB = async (groupId) => {
  return await GroupModel.findOne({ _id: groupId });
};