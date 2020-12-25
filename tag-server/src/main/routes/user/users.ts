import express, { Router } from "express";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { dbKey } from "../../config/keys";
// import passport from "passport";

import hashString from "tag-server/config/hashString";
import { User } from "tag-server/models";
import { validateUsernameRegistration } from "tag-server/validation/routes/user/register/register";
import { validateLoginInput } from "tag-server/validation/routes/user/login/login";
import { StatusCodes, UserRoutes } from "../constants";

const router: Router = express.Router();

// #region User Test

/**
 * @operation   GET
 * @route       api/users/test
 * @description User test route
 */
router.get(UserRoutes.TEST, (_req, res) =>
  res.json({
    msg: "Users API Works",
  })
);

// #endregion User Test

// #region User Registration

/**
 * @operation   POST
 * @route       api/users/register
 * @description User registration route
 */
router.post(UserRoutes.REGISTER, (req, res) => {
  const { errors, isValid } = validateUsernameRegistration(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(StatusCodes.OK).json(errors);
  }

  const { email, username, password } = req.body;

  try {
    User.findOne({
      $or: [{ email: email }, { username: username }],
    }).then(async (user) => {
      if (user) {
        if (user.email == email) errors.email = "Email already exists.";

        if (user.username == username)
          errors.username = "Username already taken.";

        return res.status(StatusCodes.OK).json(errors);
      } else {
        const encryptedPassword: string = await hashString(password);

        const newUser = new User({
          email: email.trim(),
          username: username.trim(),
          password: encryptedPassword,
        });

        console.log(newUser.password);

        newUser.save().then((user) => res.status(StatusCodes.OK).json(user));
      }
    });
  } catch (err) {
    res
      .status(StatusCodes.OK)
      .json({ err: "Problem creating user.. please try again." });
  }
});

// #endregion

// #region User Login

/**
 * @operation POST
 * @route     api/users/login
 * @desc      Login users
 */
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(StatusCodes.OK).json(errors);
  }

  const { username, password } = req.body;

  // Find user by username
  User.findOne({ username: { $regex: new RegExp(username, "i") } })
    .then(async (user) => {
      // Check for user
      if (!user) {
        errors.username = "User not found";
        return res.status(StatusCodes.OK).json(errors);
      }
      
      // Check password
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (isMatch) {
            const payload = {
              id: user.id,
              email: user.email,
              username: user.username,
              // fname: user.fname, // TODO: Link the first name, last name, and avatar
              // lname: user.lname,
              // avatar: user.avatar,
            };

            // Sign Token
            jsonwebtoken.sign(
              payload,
              dbKey.secretOrKey,
              { expiresIn: 604800 },
              (_err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token,
                });
              }
            );
          } else {
            errors.password = "Password incorrect";
            return res.status(StatusCodes.OK).json(errors);
          }
        });
    })
    .catch((_err) =>
      res.status(StatusCodes.OK).json({ err: "User not found" })
    );
});

// #endregion User Login

// #region User Logout

// #endregion User Logout

export default router;
