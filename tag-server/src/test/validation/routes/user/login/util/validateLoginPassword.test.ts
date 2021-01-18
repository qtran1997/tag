import validatePassword, {
  PasswordErrorMessages,
} from "tag-server/validation/routes/user/login/util/validateLoginPassword";

describe("validatePassword()", () => {
  it("should return the required error message", () => {
    expect(validatePassword("")).toEqual(PasswordErrorMessages.EMPTY);
  });
  it("should not return an error message", () => {
    expect(validatePassword("Test Password")).toEqual("");
  });
});
