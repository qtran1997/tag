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

// Model - User
export interface UserLinks extends mongoose.Document {
  user_id: string;
  portfolio: string;
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  facebook: string;
  youtube: string;
}

// Model - User
export interface UserProfile extends mongoose.Document {
  email: string;
  username: string;
  password: string;
}
