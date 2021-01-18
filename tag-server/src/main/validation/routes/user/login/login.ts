import { isEmpty } from "tag-server/common/util";
import { isValid } from "tag-server/validation/util";
import { ValidationReturnType } from "tag-server/common/types";
import { validatePassword, validateUsername } from "./util";

// Route - User: Login Validation
export type LoginValidationProps = {
  username?: string;
  password?: string;
};

export type LoginErrorMap = {
  username: string;
  password: string;
};

export interface LoginReturnType extends ValidationReturnType {
  errors: LoginErrorMap;
}

export type LoginValidationFunc = (
  props: LoginValidationProps
) => LoginReturnType;

/**
 * Validates the login inputs from the User
 *
 * @param username The user's inputted username for login
 * @param password The user's inputted password for login
 * @returns Object containing list of errors (or not) and if the inputs are valid
 */
export const validateLoginInput: LoginValidationFunc = ({
  username,
  password,
}) => {
  const testUsername = !isEmpty(username) ? <string>username : "";
  const testPassword = !isEmpty(password) ? <string>password : "";

  const errors: LoginErrorMap = {
    password: validatePassword(testPassword),
    username: validateUsername(testUsername),
  };

  return {
    errors,
    isValid: isValid(errors),
  };
};

export default {
  validateLoginInput,
};
