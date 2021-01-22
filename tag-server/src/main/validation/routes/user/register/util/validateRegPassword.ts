import validator from "validator";

export enum PasswordErrorMessages {
  LENGTH = `Password must be at least 6 characters.`,
  EMPTY = `Password field is required.`
}

type ValidatePasswordFunc = (password: string) => string;

const validatePassword: ValidatePasswordFunc = (password) => {
  let errorMessage = "";

  if (!validator.isLength(password, { min: 6, max: 30 })) {
    errorMessage = PasswordErrorMessages.LENGTH;
  }

  if (validator.isEmpty(password)) {
    errorMessage = PasswordErrorMessages.EMPTY;
  }

  return errorMessage;
};

export default validatePassword;
