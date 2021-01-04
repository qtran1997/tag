import validator from 'validator';

// TODO: Validate special characters
export enum LinkErrorMessages {
} 

type ValidateLinkFunc = (link: string) => string 

const validateLink: ValidateLinkFunc = (link) => {
  let errorMessage = "";
  return errorMessage;
}

export default validateLink;