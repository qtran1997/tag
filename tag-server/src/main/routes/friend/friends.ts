import express from "express";
import passport from "passport";

import { StatusCodes, FriendStatus } from "tag-server/common/constants";
import { FriendModel, UserModel } from "tag-server/common/types";
import { Friend, User } from "tag-server/models";
import FriendRoutes from "../constants/FriendRoutes";
import checkFriendExistence from "./util/checkFriendExistence";
import { checkUserExistence } from "../util";
import { RuleTester } from "eslint";

const router = express.Router();

// TODO: ADD NOTIFICATIONS TO THE OTHER USER ABOUT STATUS

/**
 * @operation GET
 * @route     api/friends/tests
 * @desc      Test friends route
 */
router.get(FriendRoutes.TEST, (_req, res) =>
  res.json({ msg: "Friends API Works" })
);

/**
 * @operation POST
 * @route     api/friends/send
 * @desc      Send friend request
 */
router.post(
  FriendRoutes.SEND,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Create 2 friend documents - one for the requester and one for the recipient in order to display 2 different statuses
    const requesterUserId = (<UserModel>req.user)._id;
    const recipientUserId = req.body.id;

    try {
      let requesterUserFriendDoc = await checkFriendExistence(
        requesterUserId,
        recipientUserId
      );

      if (!requesterUserFriendDoc) {
        requesterUserFriendDoc = await new Friend({
          requester: requesterUserId,
          recipient: recipientUserId,
        }).save();
      }

      if (requesterUserFriendDoc.status === FriendStatus.REQUESTED)
        throw new Error(`${FriendStatus.REQUESTED}`);

      // Check if users exist
      const recipientUserDoc = await checkUserExistence(recipientUserId);
      if (!recipientUserDoc) throw new Error("Recipient user does not exist");

      let recipientUserFriendDoc = await checkFriendExistence(
        recipientUserId,
        requesterUserId
      );

      if (!recipientUserFriendDoc) {
        recipientUserFriendDoc = await new Friend({
          requester: recipientUserId,
          recipient: requesterUserId,
        }).save();
      }

      // Waiting to be friends or already friends
      if (recipientUserFriendDoc.status !== FriendStatus.ADD_FRIEND) {
        let errMsg = "";
        switch (recipientUserFriendDoc.status) {
          case FriendStatus.PENDING: {
            errMsg = `${FriendStatus.PENDING}`;
            break;
          }
          case FriendStatus.REQUESTED: {
            errMsg = `${FriendStatus.REQUESTED}`;
            break;
          }
          case FriendStatus.FRIENDS: {
            errMsg = `${FriendStatus.FRIENDS}`;
            break;
          }
          default: {
            errMsg = "An error has occurred.";
            break;
          }
        }

        throw new Error(errMsg);
      }

      // Set friend status of document to pending
      recipientUserFriendDoc.status = FriendStatus.PENDING;
      await recipientUserFriendDoc.save();

      // Set friend status of document to requested
      requesterUserFriendDoc.status = FriendStatus.REQUESTED;
      await requesterUserFriendDoc.save();

      return res.json({
        success: "You have sent a friend request to this user",
      });
    } catch (err) {
      return res.status(StatusCodes.OK).json({ err: err.message });
    }
  }
);

/**
 * @operation POST
 * @route     api/friends/accept
 * @desc      Accept friend request
 */
router.post(
  FriendRoutes.ACCEPT,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // If you are accepting a friend request, then you were the recipient of the request
    const recipientUserId = (<UserModel>req.user)._id;
    const requesterUserId = req.body.id;

    try {
      // Check if both users exist
      const requesterUserDoc = await checkUserExistence(requesterUserId);
      if (!requesterUserDoc)
        throw new Error("User that sent the friend request does not exist");

      const recipientUserDoc = await checkUserExistence(recipientUserId);
      if (!recipientUserDoc) throw new Error("Fatal error: You don't exist ?");

      // Retrieve their friend docs
      let requesterFriendDoc = await checkFriendExistence(
        requesterUserId,
        recipientUserId
      );
      if (!requesterFriendDoc) {
        requesterFriendDoc = await new Friend({
          requester: requesterUserId,
          recipient: recipientUserId,
        }).save();
      }

      let recipientFriendDoc = await checkFriendExistence(
        recipientUserId,
        requesterUserId
      );
      if (!recipientFriendDoc) {
        recipientFriendDoc = await new Friend({
          requester: recipientUserId,
          recipient: requesterUserId,
        }).save();
      }

      // Check the status of both friend documents
      // Check if they are equal: Already friends or not requested
      if (recipientFriendDoc.status === requesterFriendDoc.status) {
        let errMsg = "";
        switch (recipientFriendDoc.status) {
          case FriendStatus.ADD_FRIEND: {
            errMsg = `${FriendStatus.ADD_FRIEND}`;
            break;
          }
          case FriendStatus.FRIENDS: {
            errMsg = `${FriendStatus.FRIENDS}`;
            break;
          }
          default: {
            errMsg = "Fatal Error has occurred. Unknown friend status";
            break;
          }
        }

        throw new Error(errMsg);
      }
      // Check if recipient user has a REQUESTED status and the requester user has a PENDING status
      else if (
        recipientFriendDoc.status === FriendStatus.PENDING &&
        requesterFriendDoc.status === FriendStatus.REQUESTED
      ) {
        // Set both users to friends
        requesterFriendDoc.status = FriendStatus.FRIENDS;
        await requesterFriendDoc.save();

        recipientFriendDoc.status = FriendStatus.FRIENDS;
        await recipientFriendDoc.save();

        // Add users to each other's friends list
        await User.updateOne(
          { _id: requesterUserId },
          { $addToSet: { friends: recipientUserId } }
        );

        await User.updateOne(
          { _id: recipientUserId },
          { $addToSet: { friends: requesterUserId } }
        );

        return res.json({
          success: "You have accepted this person's friend request",
        });
      } else if (
        recipientFriendDoc.status === FriendStatus.REQUESTED &&
        requesterFriendDoc.status === FriendStatus.PENDING
      ) {
        throw new Error(`${FriendStatus.PENDING}`);
      }
      // Mismatching statuses
      else {
        requesterFriendDoc.status = FriendStatus.ADD_FRIEND;
        await requesterFriendDoc.save();

        recipientFriendDoc.status = FriendStatus.ADD_FRIEND;
        await recipientFriendDoc.save();
        throw new Error(
          "Mismatching Friend Statuses for both users. Reseting..."
        );
      }
    } catch (err) {
      return res.status(StatusCodes.OK).json({ err: err.message });
    }
  }
);

/**
 * @operation POST
 * @route     api/friends/remove
 * @desc      Remove friend from list
 */
router.post(
  FriendRoutes.REMOVE,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentUserId = (<UserModel>req.user)._id;
    const recipientUserId = req.body.id;

    try {
      // Check if users exist
      const recipientUserDoc = await checkUserExistence(recipientUserId);
      if (!recipientUserDoc) throw new Error("Recipient user does not exist");

      let currentUserFriendDoc = await checkFriendExistence(
        currentUserId,
        recipientUserId
      );
      if (!currentUserFriendDoc) {
        currentUserFriendDoc = await new Friend({
          requester: currentUserFriendDoc,
          recipient: recipientUserId,
        }).save();
      }

      let recipientUserFriendDoc = await checkFriendExistence(
        recipientUserId,
        currentUserId
      );
      if (!recipientUserFriendDoc) {
        recipientUserFriendDoc = await new Friend({
          requester: recipientUserId,
          recipient: currentUserFriendDoc,
        }).save();
      }

      if (currentUserFriendDoc.status !== recipientUserFriendDoc.status) {
        throw new Error("Users are not friends");
      }

      // Check if both users are friends=
      if (
        currentUserFriendDoc.status === FriendStatus.FRIENDS &&
        recipientUserFriendDoc.status === FriendStatus.FRIENDS
      ) {
        await Friend.updateOne(
          { requester: currentUserId, recipient: recipientUserId },
          { $set: { status: FriendStatus.ADD_FRIEND } },
          { useFindAndModify: true }
        );

        await Friend.updateOne(
          { requester: recipientUserId, recipient: currentUserId },
          { $set: { status: FriendStatus.ADD_FRIEND } },
          { useFindAndModify: true }
        );

        // Add users to each other's friends list
        await User.updateOne(
          { _id: currentUserId },
          { $pull: { friends: recipientUserId } }
        );

        await User.updateOne(
          { _id: recipientUserId },
          { $pull: { friends: currentUserId } }
        );

        return res.json({
          success: "You have removed this person from your friend's list",
        });
      }
    } catch (err) {
      return res.status(StatusCodes.OK).json({ err: err.message });
    }
  }
);

/**
 * @operation POST
 * @route     api/friends/deny
 * @desc      Deny friend request
 */
router.post(
  FriendRoutes.DENY,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const currentUserId = (<UserModel>req.user)?._id;
    const recipientUserId = req.body.id;

    try {
      await Friend.updateOne(
        { requester: currentUserId, recipient: recipientUserId },
        { $set: { status: FriendStatus.ADD_FRIEND } },
        { upsert: true, new: true }
      );

      await Friend.updateOne(
        { requester: recipientUserId, recipient: recipientUserId },
        { $set: { status: FriendStatus.ADD_FRIEND } },
        { upsert: true, new: true }
      );

      // Shouldn't be added to one another's friends list but just in case
      await User.updateOne(
        { _id: currentUserId },
        { $pull: { friends: recipientUserId } }
      );

      await User.updateOne(
        { _id: recipientUserId },
        { $pull: { friends: currentUserId } }
      );

      return res.json({
        success: "You have denied this person's friend request",
      });
    } catch (err) {
      return res.status(StatusCodes.OK).json({ err: "An error has occurred" });
    }
  }
);

export default router;
