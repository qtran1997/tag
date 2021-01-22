import validator from "validator";

export enum UsernameErrorMessages {
  EMPTY = `Username field is required.`
}

type ValidateUsernameFunc = (username: string) => string;

const validateUsername: ValidateUsernameFunc = (username) => {
  let errorMessage = "";

  if (validator.isEmpty(username)) {
    errorMessage = UsernameErrorMessages.EMPTY;
  }

  return errorMessage;
};

export default validateUsername;
