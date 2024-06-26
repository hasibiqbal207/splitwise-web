import { UserModel } from "../models/index.js";

export const fetchUserByEmail = async (email) => {
  return await UserModel.findOne(
    { email },
    {
      password: 0,
    }
  );
};

export const deleteUserByEmail = async (email) => {
  return await UserModel.deleteOne({ email });
};
