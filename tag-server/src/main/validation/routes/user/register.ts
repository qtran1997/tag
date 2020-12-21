import { isEmpty } from "tag-server/util";
import { isValid, validateEmail, validatePassword, validateUsername } from "../../util";
import ValidationReturnType from "../../constants/ValidationReturnType";

interface UsernameRegReturnType extends ValidationReturnType {
  errors: {
    email: string | null;
    username: string | null;
    password: string | null;
  };
}

interface UsernameErrorMap {
  email: string | null;
  username: string | null;
  password: string | null;
}

interface UsernameValidationProps {
  email: string | undefined | null;
  username: string | undefined | null;
  password: string | undefined | null;
}

type UsernameValidationFunc = (
  props: UsernameValidationProps
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
  const errors: UsernameErrorMap = {
    email: null,
    username: null,
    password: null,
  };

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
