"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias");
var express_1 = __importDefault(require("express"));
var users_1 = __importDefault(require("tag-server/routes/user/users"));
var serverapp = express_1.default();
var port = process.env.PORT ? parseInt(process.env.PORT) : 5000;
serverapp.use("/api/users", users_1.default);
var server = serverapp.listen(port, function () {
    return console.log("Server running on port " + port);
});
