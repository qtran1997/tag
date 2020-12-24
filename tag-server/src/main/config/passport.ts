import { PassportStatic } from "passport";
import PassportJWT from "passport-jwt";
import { dbKey } from "./keys";

const JwtStrategy = PassportJWT.Strategy;
const ExtractJwt = PassportJWT.ExtractJwt;

import User from "../models/User";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: dbKey.secretOrKey,
};

const passportCheck = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};

export default passportCheck;
