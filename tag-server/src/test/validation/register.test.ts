import { UserRegistrationValidation } from "tag-server/validation";

describe("UserRegistrationValidation", () => {
  describe("validateUsernameRegistration", () => {
    const { validateUsernameRegistration } = UserRegistrationValidation;

    it("should return a map with no errors and isValid is true", () => {
      const usernameRegInput = {
        email: "testEmail@test.com",
        username: "testUsername",
        password: "testPassword"
      }
      const {
        errors,
        isValid
      } = validateUsernameRegistration(usernameRegInput)
      expect(errors.email).toEqual("");
      expect(errors.username).toEqual("");
      expect(errors.password).toEqual("");
      expect(isValid).toEqual(true);
    })

    it("should return a map with 3 errors and isValid is false", () => {
      const usernameRegInput = {
        email: "testEmail",
        username: "U",
        password: "P"
      }
      const {
        errors,
        isValid
      } = validateUsernameRegistration(usernameRegInput)
      expect(errors.email).not.toEqual("");
      expect(errors.username).not.toEqual("");
      expect(errors.password).not.toEqual("");
      expect(isValid).toEqual(false);
    })

    it("should return a map with 3 errors and isValid is false", () => {
      const usernameRegInput = {
        email: "",
        username: "",
        password: ""
      }
      const {
        errors,
        isValid
      } = validateUsernameRegistration(usernameRegInput)
      expect(errors.email).not.toEqual("");
      expect(errors.username).not.toEqual("");
      expect(errors.password).not.toEqual("");
      expect(isValid).toEqual(false);
    })
  });
});
