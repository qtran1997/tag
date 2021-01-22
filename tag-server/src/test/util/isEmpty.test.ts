import { isEmpty } from "tag-server/common/util";

describe("isEmpty()", () => {
  describe("type object", () => {
    it("should return true if input object is undefined", () => {
      expect(isEmpty(undefined)).toEqual(true);
    });
    it("should return true if input object is null", () => {
      expect(isEmpty(null)).toEqual(true);
    });
    it("should return true if input object does not have entries", () => {
      const inputObject: object = {};
      expect(isEmpty(inputObject)).toEqual(true);
    });
    it("should return false if input object has entries", () => {
      const inputObject1: object = {
        testKey: "testValue"
      };
      expect(isEmpty(inputObject1)).toEqual(false);

      const inputObject2: object = {
        testKey: "testValue",
        testKey2: "testValue2"
      };
      expect(isEmpty(inputObject2)).toEqual(false);
    });
  });
  describe("type string", () => {
    it("should return true if input string is undefined", () => {
      expect(isEmpty(undefined)).toEqual(true);
    });
    it("should return true if input string is null", () => {
      expect(isEmpty(null)).toEqual(true);
    });
    it("should return true if input string has 0 characters", () => {
      const inputString: string = "";
      expect(isEmpty(inputString)).toEqual(true);
    });
    it("should return false if input string has more than 0 characters", () => {
      const inputString1: string = "a";
      expect(isEmpty(inputString1)).toEqual(false);
      const inputString2: string = "ab";
      expect(isEmpty(inputString2)).toEqual(false);
    });
  });
});
