import bcrypt from "bcryptjs";
import hashSalt from "tag-server/config/hashSalt";

type HashStringFunc = (string: string) => Promise<string>;

const hashString: HashStringFunc = (string) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(hashSalt, (_err, salt) => {
      bcrypt.hash(string, salt, (err, hash) => {
        if (err) reject(err);

        resolve(hash);
      });
    });
  });

export default hashString;
