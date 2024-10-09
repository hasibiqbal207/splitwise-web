import UserModel, { UserDocument } from "../models/user.model.js";

export const fetchUserByEmail = async (
  email: string
): Promise<UserDocument | null> => {
  return await UserModel.findOne(
    { email },
    {
      password: 0,
    }
  );
};

export const deleteUserByEmail = async (
  email: string
): Promise<{ deletedCount?: number }> => {
  return await UserModel.deleteOne({ email });
};

export const updateUserData = async (
  firstName: string,
  lastName: string,
  email: string
): Promise<UserDocument | null> => {
  return await UserModel.findOneAndUpdate(
    { email },
    {
      $set: {
        firstName,
        lastName,
      },
    },
    { new: true, select: '-password' }
  );
};

export const fetchAllUsers = async (): Promise<
  Pick<UserDocument, "firstName" | "lastName" | "email">[]
> => {
  return await UserModel.find(
    {},
    {
      firstName: 1,
      lastName: 1,
      email: 1,
      _id: 0,
    }
  );
};
