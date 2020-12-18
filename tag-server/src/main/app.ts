import "module-alias/register";
import express, { Express } from "express";

import { UsersApi } from "tag-server/routes";

export enum ServerRoutes {
  USERS = "/api/users",
}

const serverapp: Express = express();

let port: Number;

if(process.env.PORT)
  port = parseInt(process.env.PORT);
else if(process.env.NODE_ENV === "test") // Unit tests
  port = 5050;
else // Dev and Production default
  port = 5000;

// const port: Number = process.env.PORT ? parseInt(process.env.PORT) : 5000;

serverapp.use(ServerRoutes.USERS, UsersApi);

const server = serverapp.listen(port, (): void =>
  console.log(`Server running on port ${port}`)
);

export default server;
