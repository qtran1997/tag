import mongoose from "mongoose";

import FriendStatus from "./constants/FriendStatus";

// Route - General Validation
export type ValidationReturnType = {
  errors: object;
  isValid: boolean;
};

// Model - Friend
export interface FriendModel extends mongoose.Document {
  requester: string;
  recipient: string;
  status: FriendStatus;
}

export interface FriendStatusModel {
  type: Number;
  enums: FriendStatus[];
  default: FriendStatus.ADD_FRIEND;
}

// Model - User
export interface UserModel extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  userLinks: mongoose.Schema.Types.ObjectId;
  friends: mongoose.Schema.Types.ObjectId[];
}

// Model - User Links
export interface UserLinks extends mongoose.Document {
  user_id: mongoose.Schema.Types.ObjectId;
  portfolio: string;
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  facebook: string;
  youtube: string;
}

// Model - User Profile
export interface UserProfile extends mongoose.Document {
  email: string;
  username: string;
  password: string;
}
