/**
 * Returns a string with random characters depending on the inputted length
 *
 * @param {number} length length of the string
 * @returns {string} random string with inputted length
 */
const randomString = (length: number) =>
  Math.random().toString(36).substring(0, length);

export default randomString;
