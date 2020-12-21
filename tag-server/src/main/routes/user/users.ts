import express, { Router } from "express";
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
});

export default router;
