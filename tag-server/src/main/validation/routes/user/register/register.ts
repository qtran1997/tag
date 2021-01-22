import { isEmpty } from "tag-server/common/util";
import { isValid } from "tag-server/validation/util";
import { ValidationReturnType } from "tag-server/common/types";
import { validateEmail, validatePassword, validateUsername } from "./util";

export type UsernameRegValidationProps = {
  email?: string;
  username?: string;
  password?: string;
};

export type UsernameRegErrorMap = {
  email: string;
  username: string;
  password: string;
};

export interface UsernameRegReturnType extends ValidationReturnType {
  errors: UsernameRegErrorMap;
}

export type UsernameValidationFunc = (
  props: UsernameRegValidationProps
) => UsernameRegReturnType;

/**
 * Validates the registration inputs from the User
 *
 * @param email The user's inputted email for registration
 * @param username The user's inputted username for registration
 * @param password The user's inputted password for registration
 * @returns Object containing list of errors (or not) and if the inputs are valid
 */
export const validateUsernameRegistration: UsernameValidationFunc = ({
  email,
  username,
  password
}) => {
  const testEmail = !isEmpty(email) ? <string>email : "";
  const testUsername = !isEmpty(username) ? <string>username : "";
  const testPassword = !isEmpty(password) ? <string>password : "";

  const errors: UsernameRegErrorMap = {
    email: validateEmail(testEmail),
    password: validatePassword(testPassword),
    username: validateUsername(testUsername)
  };

  return {
    errors,
    isValid: isValid(errors)
  };
};

export default {
  validateUsernameRegistration
};
