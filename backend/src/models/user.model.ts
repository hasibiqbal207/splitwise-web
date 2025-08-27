import mongoose, { Document, Model } from "mongoose";

// Define the interface for the User document
interface IUser {
  firstName: string;
  lastName?: string; // Optional
  email: string;
  password: string;
}

// Extend mongoose's Document to include our IUser fields
export interface UserDocument extends IUser, Document {}

// Define the user schema
const userSchema = new mongoose.Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    collection: "users",
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create the model with type support
const UserModel: Model<UserDocument> =
  mongoose.models.UserModel ||
  mongoose.model<UserDocument>("UserModel", userSchema);

export default UserModel;
