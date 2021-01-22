import express, { Router } from "express";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { dbKey } from "../../config/keys";
import passport from "passport";

import { StatusCodes } from "tag-server/common/constants";
import hashString from "tag-server/config/hashString";
import { User, UserLinks } from "tag-server/models";
import { validateUsernameRegistration } from "tag-server/validation/routes/user/register/register";
import { validateUserLinksRegistration } from "tag-server/validation/routes/user/register/links/registerLinks";
import { validateLoginInput } from "tag-server/validation/routes/user/login/login";
import { UserRoutes } from "../constants";

const router: Router = express.Router();

// #region User Test

/**
 * @operation   GET
 * @route       api/users/test
 * @description User test route
 */
router.get(UserRoutes.TEST, (_req, res) =>
  res.json({
    msg: "Users API Works"
  })
);

// #endregion User Test

// #region User Registration

/**
 * @operation   POST
 * @route       api/users/register
 * @description User registration route
 */
router.post(UserRoutes.REGISTER, async (req, res) => {
  const { errors, isValid } = validateUsernameRegistration(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(StatusCodes.OK).json(errors);
  }

  const { email, username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: email }, { username: username }]
    });

    if (user) {
      if (user.email == email) errors.email = "Email already exists.";

      if (user.username == username)
        errors.username = "Username already taken.";

      return res.status(StatusCodes.OK).json(errors);
    } else {
      const encryptedPassword = await hashString(password);

      const newUser = new User({
        email: email.trim(),
        username: username.trim(),
        password: encryptedPassword
      });

      const savedUser = await newUser.save();

      if (savedUser) {
        return res.status(StatusCodes.OK).json(savedUser);
      } else {
        throw new Error();
      }
    }
  } catch (err) {
    return res
      .status(StatusCodes.OK)
      .json({ err: "Problem creating user.. please try again." });
  }
});

import { UserModel } from "tag-server/common/types";

/**
 * @operation   POST
 * @route       api/users/register/links
 * @description User links and social media registration route
 */
router.post(
  UserRoutes.REGISTER_LINKS,
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateUserLinksRegistration(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(StatusCodes.OK).json(errors);
    }

    const {
      facebook,
      github,
      instagram,
      linkedin,
      portfolio,
      twitter,
      youtube
    } = req.body;

    const user = <UserModel>req.user;

    try {
      if (user) {
        const userLinks = await UserLinks.findOne({ user_id: user._id });

        let savedUserLinks = null;

        if (userLinks) {
          await userLinks.updateOne({
            facebook: facebook ? facebook.trim() : userLinks.facebook,
            github: github ? github.trim() : userLinks.github,
            instagram: instagram ? instagram.trim() : userLinks.instagram,
            linkedin: linkedin ? linkedin.trim() : userLinks.linkedin,
            portfolio: portfolio ? portfolio.trim() : userLinks.portfolio,
            twitter: twitter ? twitter.trim() : userLinks.twitter,
            youtube: youtube ? youtube.trim() : userLinks.youtube
          });

          savedUserLinks = userLinks;
        } else {
          const newUserLinks = new UserLinks({
            user_id: user._id,
            facebook: facebook && facebook.trim(),
            github: github && github.trim(),
            instagram: instagram && instagram.trim(),
            linkedin: linkedin && linkedin.trim(),
            portfolio: portfolio && portfolio.trim(),
            twitter: twitter && twitter.trim(),
            youtube: youtube && youtube.trim()
          });

          savedUserLinks = await newUserLinks.save();
        }

        // Add the user link document to the user
        const userToSave = await User.findById(user._id);
        if (!userToSave) throw new Error();

        userToSave.userLinks = savedUserLinks._id;
        await userToSave.save();

        return res.status(StatusCodes.OK).json(savedUserLinks);
      }

      throw new Error();
    } catch (err) {
      return res.status(StatusCodes.OK).json({
        err: "Problem registering user links.. please try again."
      });
    }
  }
);

// #endregion

// #region User Login

/**
 * @operation POST
 * @route     api/users/login
 * @desc      Login users
 */
router.post(UserRoutes.LOGIN, (req, res) => {
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
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            email: user.email,
            username: user.username
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
                token: `Bearer ${token}`
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

export default router;
