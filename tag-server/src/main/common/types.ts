import mongoose from "mongoose";

// Route - General Validation
export type ValidationReturnType = {
  errors: object;
  isValid: boolean;
};

// Model - User
export interface UserModel extends mongoose.Document {
  email: string;
  username: string;
  password: string;
}
