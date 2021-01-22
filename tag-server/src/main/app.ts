import "module-alias/register";
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";

import ServerRoutes from "tag-server/common/constants/ServerRoutes";
import { dbKey } from "tag-server/config/keys";
import mongooseOptions from "tag-server/config/mongooseOptions";
import passportCheck from "tag-server/config/passport";

import { FriendsApi, UsersApi } from "tag-server/routes";
import cors from "cors";

if (process.env.NODE_ENV !== "test") {
  const db = dbKey.mongoURI;

  // Connect to MongoDB
  mongoose
    .connect(db, mongooseOptions)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
}

const serverapp: Express = express();

if (process.env.NODE_ENV === "development") {
  serverapp.use(cors());
}

// parses the request body to be a readable json format
serverapp.use(bodyParser.urlencoded({ extended: false }));
serverapp.use(bodyParser.json());

// Passport middleware
serverapp.use(passport.initialize());

// Passport Config
passportCheck(passport);

let port: Number;

if (process.env.PORT) port = parseInt(process.env.PORT);
else if (process.env.NODE_ENV === "test")
  // Unit tests
  port = 5050;
// Dev and Production default
else port = 5000;

serverapp.use(ServerRoutes.USERS, UsersApi);
serverapp.use(ServerRoutes.FRIENDS, FriendsApi);

const server = serverapp.listen(port, (): void => {
  if (process.env.NODE_ENV !== "test")
    console.log(`Server running on port ${port}`);
});

export default server;
