import validator from "validator";

export enum PasswordErrorMessages {
  EMPTY = `Password field is required.`,
}

type ValidatePasswordFunc = (password: string) => string;

const validatePassword: ValidatePasswordFunc = (password) => {
  let errorMessage = "";

  if (validator.isEmpty(password)) {
    errorMessage = PasswordErrorMessages.EMPTY;
  }

  return errorMessage;
};

export default validatePassword;
