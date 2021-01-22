import mongoose from "mongoose";
import { UserLinks } from "tag-server/common/types";

const Schema = mongoose.Schema;

const UserLinksSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    portfolio: {
      type: String,
      default: ""
    },
    github: {
      type: String,
      default: ""
    },
    linkedin: {
      type: String,
      default: ""
    },
    instagram: {
      type: String,
      default: ""
    },
    twitter: {
      type: String,
      default: ""
    },
    facebook: {
      type: String,
      default: ""
    },
    youtube: {
      type: String,
      default: ""
    }
    // TODO: Other links
  },
  { timestamps: true }
);

const User = mongoose.model<UserLinks>("userlinks", UserLinksSchema);

export default User;
