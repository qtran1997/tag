import express, { Router } from "express";
import { UserRoutes } from "../constants";

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

export default router;
