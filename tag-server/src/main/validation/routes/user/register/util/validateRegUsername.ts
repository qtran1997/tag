import validator from "validator";

export enum UsernameErrorMessages {
  LENGTH = `Username must be between 5 and 18 characters.`,
  EMPTY = `Username field is required.`
}

type ValidateUsernameFunc = (username: string) => string;

const validateUsername: ValidateUsernameFunc = (username) => {
  let errorMessage = "";

  if (!validator.isLength(username, { min: 5, max: 18 })) {
    errorMessage = UsernameErrorMessages.LENGTH;
  }

  if (validator.isEmpty(username)) {
    errorMessage = UsernameErrorMessages.EMPTY;
  }

  return errorMessage;
};

export default validateUsername;
