type isValidFunc = (errors: object) => boolean;

const isValid: isValidFunc = (errors) =>
  Object.values(errors).every((errorMsg) => errorMsg === "");

export default isValid;
