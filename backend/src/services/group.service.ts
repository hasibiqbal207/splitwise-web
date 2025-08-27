import { GroupModel, SettlementModel } from "../models/index.js";
import { GroupDocument } from "../models/group.model.js"; 
import { SettlementDocument } from "../models/settlement.model.js"; 

// Type for groupData to ensure type safety
interface GroupData {
  groupName: string;
  groupDescription?: string;
  groupCurrency: string;
  groupOwner: string;
  groupMembers: string[];
  groupCategory?: string;
  groupTotal?: number;
  split: Record<string, number>[]; 
}

interface SettlementData {
  groupId: string;
  payer: string;
  payee: string;
  amount: number;
  date: Date;
}

// Create a group in the database
export const createGroupinDB = async (
  groupData: GroupData
): Promise<GroupDocument> => {
  const newGroup = new GroupModel(groupData);
  return await newGroup.save();
};

// Find a group by its ID
export const findGroupByID = async (
  groupId: string
): Promise<GroupDocument | null> => {
  return await GroupModel.findOne({ _id: groupId });
};

// Update a group in the database
export const updateGroupinDB = async (
  groupData: Partial<GroupData> & { id: string }
): Promise<GroupDocument | null> => {
  return await GroupModel.findOneAndUpdate(
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
    },
    { new: true }
  );
};

// Delete a group by its ID
export const deleteGroupinDB = async (
  groupId: string
): Promise<{ deletedCount?: number }> => {
  return await GroupModel.deleteOne({ _id: groupId });
};

// Get groups for a specific user by email
export const getUserGroups = async (
  email: string
): Promise<GroupDocument[]> => {
  return await GroupModel.find({ groupMembers: email }).sort({
    $natural: -1, // To get the newest first
  });
};

// Get users in a specific group by group ID
export const getGroupUsers = async (
  groupId: string
): Promise<{ groupMembers: string[] } | null> => {
  return await GroupModel.findOne(
    { _id: groupId },
    {
      groupMembers: 1,
      _id: 0,
    }
  );
};

// Update the split in a specific group
export const updateGroupSplit = async (
  groupId: string,
  split: Record<string, number>
): Promise<GroupDocument | null> => {
  return await GroupModel.findOneAndUpdate({ _id: groupId }, { $set: { split } },{ new: true });
};

// Create a settlement in the database
export const createSettlement = async (
  settlementData: SettlementData
): Promise<SettlementDocument> => {
  return await SettlementModel.create(settlementData);
};
