import validatePassword, {
  PasswordErrorMessages
} from "tag-server/validation/routes/user/register/util/validateRegPassword";

describe("validatePassword()", () => {
  it("should return the required error message ", () => {
    expect(validatePassword("")).toEqual(PasswordErrorMessages.EMPTY);
  });
  it("should return the length error message", () => {
    expect(validatePassword("Test")).toEqual(PasswordErrorMessages.LENGTH);
  });
  it("should not return an error message", () => {
    expect(validatePassword("Test Password")).toEqual("");
  });
});
