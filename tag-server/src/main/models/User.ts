import mongoose from "mongoose";
import { UserModel } from "tag-server/common/types";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserModel>("users", UserSchema);

export default User;