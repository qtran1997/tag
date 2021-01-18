import { randomString } from "tag-server/common/util";

describe("randomString()", () => {
  it("should return a string with the length as the inputted length", () => {
    const length1 = 5;
    const length2 = 10;
    const length3 = 12;

    expect(randomString(length1).length).toEqual(length1);
    expect(randomString(length2).length).toEqual(length2);
    expect(randomString(length3).length).toEqual(length3);
  });

  it("should return a different string every time", () => {
    const length = 5;
    expect(randomString(length)).not.toEqual(randomString(length));
  });
});
