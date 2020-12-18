"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
/**
 * @operation   GET
 * @route       api/users/test
 * @description User test route
 */
router.get("/test", function (_req, res) {
    return res.json({
        msg: "Users API Works",
    });
});
exports.default = router;
