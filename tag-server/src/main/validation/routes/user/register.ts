import { isEmpty } from "tag-server/util";
import {
  isValid,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../util";
import { ValidationReturnType } from "tag-server/common/types";

// Route - User: Registration Validation
export type UsernameRegValidationProps = {
  email?: string;
  username?: string;
  password?: string;
}

export type UsernameErrorMap = {
  email?: string;
  username?: string;
  password?: string;
}

export interface UsernameRegReturnType extends ValidationReturnType {
  errors: UsernameErrorMap;
}

export type UsernameValidationFunc = (
  props: UsernameRegValidationProps
) => UsernameRegReturnType;

/**
 * Validates the registration inputs from the User
 *
 */
export const validateUsernameRegistration: UsernameValidationFunc = ({
  email,
  username,
  password,
}) => {
  const errors: UsernameErrorMap = {};

  const testEmail = !isEmpty(email) ? <string>email : "";
  const testUsername = !isEmpty(username) ? <string>username : "";
  const testPassword = !isEmpty(password) ? <string>password : "";

  errors.email = validateEmail(testEmail);
  errors.password = validatePassword(testPassword);
  errors.username = validateUsername(testUsername);

  return {
    errors,
    isValid: isValid(errors),
  };
};

export default {
  validateUsernameRegistration,
};
