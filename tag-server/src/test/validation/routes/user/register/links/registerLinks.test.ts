import { validateUserLinksRegistration } from "tag-server/validation/routes/user/register/links/registerLinks";

describe("registerLinks", () => {
  describe("validateUserLinksRegistration()", () => {
    it("should return a map with no errors and isValid is true when inputs are filled", () => {
      const userLinkRegInput = {
        facebook: "facebook.com",
        github: "github.com",
        instagram: "instagram.com",
        linkedin: "linkedin.com",
        portfolio: "portfolio.com",
        twitter: "twitter.com",
        youtube: "youtube.com"
      };

      const { errors, isValid } = validateUserLinksRegistration(
        userLinkRegInput
      );

      expect(errors.facebook).toEqual("");
      expect(errors.github).toEqual("");
      expect(errors.instagram).toEqual("");
      expect(errors.linkedin).toEqual("");
      expect(errors.portfolio).toEqual("");
      expect(errors.twitter).toEqual("");
      expect(errors.youtube).toEqual("");
      expect(isValid).toEqual(true);
    });

    it("should return a map with no errors and isValid is true when inputs are empty", () => {
      const userLinkRegInput = {};

      const { errors, isValid } = validateUserLinksRegistration(
        userLinkRegInput
      );

      expect(errors.facebook).toEqual("");
      expect(errors.github).toEqual("");
      expect(errors.instagram).toEqual("");
      expect(errors.linkedin).toEqual("");
      expect(errors.portfolio).toEqual("");
      expect(errors.twitter).toEqual("");
      expect(errors.youtube).toEqual("");
      expect(isValid).toEqual(true);
    });
  });
});
