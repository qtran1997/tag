import mongoose from "mongoose";
import { UserModel } from "tag-server/common/types";

const Schema = mongoose.Schema;

const UserProfileSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model<UserModel>("userprofiles", UserProfileSchema);

export default User;
