import validator from "validator";

export enum EmailErrorMessages {
  INVALID = `Email is invalid.`,
  EMPTY = `Email field is required.`
}

type ValidateEmailFunc = (email: string) => string;

const validateEmail: ValidateEmailFunc = (email) => {
  let errorMessage = "";

  if (!validator.isEmail(email)) {
    errorMessage = EmailErrorMessages.INVALID;
  }

  if (validator.isEmpty(email)) {
    errorMessage = EmailErrorMessages.EMPTY;
  }

  return errorMessage;
};

export default validateEmail;
