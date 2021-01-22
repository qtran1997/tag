import { toObjectId } from "tag-server/common/util";

describe("toObjectId()", () => {
  it("should not throw an error if the inputted string is 24 hex characters as a mongoose ObjectId", () => {
    toObjectId("5ff5635efa3b9c89d494e7c4");
  });
});
