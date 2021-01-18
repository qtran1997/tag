import { FriendModel } from "tag-server/common/types";
import { Friend } from "tag-server/models";

type checkFriendExistenceFunc = (
  user1: string,
  user2: string
) => Promise<FriendModel | null>;

/**
 * Checks if the request and recipient user both exist. Used in the friends route.
 *
 * @param {string} user1 The id of the first user
 * @param {string} user2 The id of the second user
 * @returns {boolean} returns true if the user exists, otherwise false
 */
const checkFriendExistence: checkFriendExistenceFunc = async (
  user1,
  user2
) => {
  const friendExists = await Friend.findOne({
    requester: user1,
    recipient: user2,
  });

  return friendExists;
};

export default checkFriendExistence;
