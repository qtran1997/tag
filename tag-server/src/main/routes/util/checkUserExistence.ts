import { UserModel } from "tag-server/common/types";
import { User } from "tag-server/models";

type checkUserExistenceFunc = (userId: string) => Promise<UserModel | null>;
/**
 * Checks if the request and recipient user both exist. Used in the friends route.
 *
 * @param {string} userId The id of the user
 * @returns {boolean} returns true if the user exists, otherwise false
 */
const checkUserExistence: checkUserExistenceFunc = async (userId) => {
  const userExists = await User.findOne({ _id: userId });

  return userExists;
};

export default checkUserExistence;
