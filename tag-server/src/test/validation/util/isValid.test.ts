import { isValid } from "tag-server/validation/util";

describe("isValid()", () => {
  it("should return false if error map does not contain only empty strings", () => {
    const errors = {
      error: "this is an error",
    };
    expect(isValid(errors)).toEqual(false);
  });
  it("should return true if error map contains only empty strings", () => {
    const errors = {
      error: "",
    };
    expect(isValid(errors)).toEqual(true);
  });
});
