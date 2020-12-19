import "module-alias/register";
import express, { Express } from "express";
import mongoose from "mongoose";

import { UsersApi } from "tag-server/routes";
import { dbKey } from "tag-server/config/keys";

const db = dbKey.mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

export enum ServerRoutes {
  USERS = "/api/users",
}

const serverapp: Express = express();

let port: Number;

if (process.env.PORT) port = parseInt(process.env.PORT);
else if (process.env.NODE_ENV === "test")
  // Unit tests
  port = 5050;
// Dev and Production default
else port = 5000;

// const port: Number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

serverapp.use(ServerRoutes.USERS, UsersApi);

const server = serverapp.listen(port, (): void =>
  console.log(`Server running on port ${port}`)
);

export default server;
