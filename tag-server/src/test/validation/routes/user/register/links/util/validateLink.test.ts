import validateLink from "tag-server/validation/routes/user/register/links/util/validateLink";

describe("validateLink()", () => {
  it("should return an empty string... for now", () => {
    expect(validateLink("")).toEqual("");
  })
})