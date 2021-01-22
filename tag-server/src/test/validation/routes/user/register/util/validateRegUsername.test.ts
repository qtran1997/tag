import validateUsername, {
  UsernameErrorMessages
} from "tag-server/validation/routes/user/register/util/validateRegUsername";

describe("validateUsername()", () => {
  it("should return the required error message ", () => {
    expect(validateUsername("")).toEqual(UsernameErrorMessages.EMPTY);
  });
  it("should return the length error message", () => {
    expect(validateUsername("Test")).toEqual(UsernameErrorMessages.LENGTH);
  });
  it("should not return an error message", () => {
    expect(validateUsername("Test Username")).toEqual("");
  });
});
