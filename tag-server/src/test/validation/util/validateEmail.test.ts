import validateEmail, {
  EmailErrorMessages,
} from "tag-server/validation/util/validateEmail";

describe("validateEmail()", () => {
  it("should return the required error message ", () => {
    expect(validateEmail("")).toEqual(EmailErrorMessages.EMPTY);
  });
  it("should return the invalid error message", () => {
    expect(validateEmail("Test")).toEqual(EmailErrorMessages.INVALID);
  });
  it("should not return an error message", () => {
    expect(validateEmail("TestEmail@gmail.com")).toEqual("");
  })
});
