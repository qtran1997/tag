import { isEmpty } from "tag-server/util";
import { isValid } from "tag-server/validation/util";
import { ValidationReturnType } from "tag-server/common/types";
import {
  validateLink,
} from "./util";

export type UserLinksRegValidationProps = {
  facebook?: string;
  github?: string;
  instagram?: string;
  linkedin?: string;
  portfolio?: string;
  twitter?: string;
  youtube?: string;
};

export type UserLinksRegErrorMap = {
  facebook: string;
  github: string;
  instagram: string;
  linkedin: string;
  portfolio: string;
  twitter: string;
  youtube: string;
};

export interface UserLinksRegReturnType extends ValidationReturnType {
  errors: UserLinksRegErrorMap;
}

export type UserLinksValidationFunc = (
  props: UserLinksRegValidationProps
) => UserLinksRegReturnType;

/**
 * Validates the link registration inputs from the User
 *
 * @param facebook The user's inputted facebook link for registration
 * @param github The user's inputted github link for registration
 * @param instagram The user's inputted instagram link for registration
 * @param linkedin The user's inputted linkedin link for registration
 * @param portfolio The user's inputted portfolio link for registration
 * @param twitter The user's inputted twitter link for registration
 * @param youtube The user's inputted youtube link for registration
 * @returns Object containing list of errors (or not) and if the inputs are valid
 */
export const validateUserLinksRegistration: UserLinksValidationFunc = ({
  facebook,
  github,
  instagram,
  linkedin,
  portfolio,
  twitter,
  youtube,
}) => {
  const testFacebookLink = !isEmpty(facebook) ? <string>facebook : "";
  const testGithubLink = !isEmpty(github) ? <string>github : "";
  const testInstagramLink = !isEmpty(instagram) ? <string>instagram : "";
  const testLinkedinLink = !isEmpty(linkedin) ? <string>linkedin : "";
  const testPortfolioLink = !isEmpty(portfolio) ? <string>portfolio : "";
  const testTwitterLink = !isEmpty(twitter) ? <string>twitter : "";
  const testYoutubeLink = !isEmpty(youtube) ? <string>youtube : "";

  const errors: UserLinksRegErrorMap = {
    facebook: validateLink(testFacebookLink),
    github: validateLink(testGithubLink),
    instagram: validateLink(testInstagramLink),
    linkedin: validateLink(testLinkedinLink),
    portfolio: validateLink(testPortfolioLink),
    twitter: validateLink(testTwitterLink),
    youtube: validateLink(testYoutubeLink),
  };

  return {
    errors,
    isValid: isValid(errors),
  };
};

export default {
  validateUserLinksRegistration,
};
