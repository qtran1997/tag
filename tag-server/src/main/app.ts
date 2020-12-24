import "module-alias/register";
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passport from "passport";

import { dbKey } from "tag-server/config/keys";
import passportCheck from "tag-server/config/passport";

import { UsersApi } from "tag-server/routes";

export enum ServerRoutes {
  USERS = "/api/users",
}

if (process.env.NODE_ENV !== "test") {
  const db = dbKey.mongoURI;

  // Connect to MongoDB
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
}

const serverapp: Express = express();

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

const server = serverapp.listen(port, (): void => {
  if (process.env.NODE_ENV !== "test")
    console.log(`Server running on port ${port}`);
});

export default server;
