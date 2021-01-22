import mongoose from "mongoose";
import { FriendModel } from "tag-server/common/types";

import FriendStatus from "../../common/constants/FriendStatus";

const Schema = mongoose.Schema;

// Create Schema
const FriendsSchema = new Schema(
  {
    requester: { type: Schema.Types.ObjectId, ref: "users" },
    recipient: { type: Schema.Types.ObjectId, ref: "users" },
    status: {
      type: Number,
      enums: [
        FriendStatus.ADD_FRIEND,
        FriendStatus.REQUESTED,
        FriendStatus.FRIENDS,
        FriendStatus.PENDING
      ],
      default: FriendStatus.ADD_FRIEND
    }
  },
  { timestamps: true }
);

// Creates schema in the database
const Friend = mongoose.model<FriendModel>("friends", FriendsSchema);

export default Friend;
