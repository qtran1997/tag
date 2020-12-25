import hashString from "tag-server/config/hashString";

describe("hashString()", () => {
  // TODO: Investigate test how to trigger an error
  xit("should resolve an error if a string is not inputted", async (done) => {
    const hashedString = await hashString("fart");
    done();
  });

  it("should return a hashed string", async (done) => {
    const hashedString = await hashString("fart");
    expect(hashedString.length).not.toEqual(0);
    expect(typeof hashedString).toBe("string");
    done();
  });
});
