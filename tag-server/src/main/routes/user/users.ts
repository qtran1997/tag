import express, { Router } from "express";

import { User } from "tag-server/models";
import { hashString } from "tag-server/util";
import { validateUsernameRegistration } from "tag-server/validation/routes/user/register";
import { StatusCodes, UserRoutes } from "../constants";

const router: Router = express.Router();

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

/**
 * @operation   POST
 * @route       api/users/register
 * @description User registration route
 */
router.post(UserRoutes.REGISTER, (req, res) => {
  const { errors, isValid } = validateUsernameRegistration(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(StatusCodes.BAD_REQUEST).json(errors);
  }

  try {
    User.findOne({
      $or: [{ email: req.body.email }, { username: req.body.username }],
    }).then(async (user) => {
      if (user) {
        if (user.email == req.body.email)
          errors.email = "Email already exists.";

        if (user.username == req.body.username)
          errors.username = "Username already taken.";

        return res.status(StatusCodes.OK).json(errors);
      } else {
        let encryptedPassword: string;

        encryptedPassword = await hashString(req.body.password);

        const newUser = new User({
          email: req.body.email.trim(),
          username: req.body.username.trim(),
          password: encryptedPassword,
        });

        newUser.save().then((user) => res.status(StatusCodes.OK).json(user));
      }
    });
  } catch (err) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ err: "Problem creating user.. please try again." });
  }
});

export default router;
