import { UserLoginValidation } from "tag-server/validation";

describe("UserLoginValidation()", () => {
  describe("validateLoginInput", () => {
    const { validateLoginInput } = UserLoginValidation;

    it("should return a map with no errors and isValid is true", () => {
      const usernameRegInput = {
        username: "testUsername",
        password: "testPassword"
      };
      const { errors, isValid } = validateLoginInput(usernameRegInput);
      expect(errors.username).toEqual("");
      expect(errors.password).toEqual("");
      expect(isValid).toEqual(true);
    });

    it("should return a map with 2 errors and isValid is false", () => {
      const usernameRegInput = {
        username: "",
        password: ""
      };
      const { errors, isValid } = validateLoginInput(usernameRegInput);
      expect(errors.username).not.toEqual("");
      expect(errors.password).not.toEqual("");
      expect(isValid).toEqual(false);
    });
  });
});
