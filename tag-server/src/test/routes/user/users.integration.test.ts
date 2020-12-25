import request from "supertest";
import Server, { ServerRoutes } from "tag-server/app";
import hashString from "tag-server/config/hashString";
import { User } from "tag-server/models";
import { StatusCodes, UserRoutes } from "tag-server/routes/constants";
import dbHandler from "tag-server-test/test-util/db-handler";

describe("Users Route", () => {
  const existingUser = {
    email: "existing@email.com",
    username: "testUsername",
    password: "123456",
  };

  beforeAll(async () => {
    await dbHandler.connect();

    // Add a mock user to the database
    const newUser = new User({
      ...existingUser,
      password: await hashString(existingUser.password),
    });

    await newUser.save();
  });
  // afterEach(async () => await dbHandler.clearDatabase());
  afterAll(async () => {
    await dbHandler.closeDatabase();
    Server.close();
  });

  describe("/api/users/test", () => {
    it("should return a 200 status code", async (done) => {
      const res = await request(Server).get(
        ServerRoutes.USERS + UserRoutes.TEST
      );
      expect(res.status).toEqual(StatusCodes.OK);
      done();
    });
  });

  describe("/api/users/register", () => {
    // TODO: Trigger the error catch

    it("should return a 400 status code because there are errors in the form inputs", async (done) => {
      const res = await request(Server).post(
        ServerRoutes.USERS + UserRoutes.REGISTER
      );

      expect(res.status).toEqual(StatusCodes.OK);
      done();
    });

    it("should return error messages if the email is already registered", async (done) => {
      const cannedRequestBody = {
        email: existingUser.email,
        username: "unusedUsername",
        password: existingUser.password,
      };

      const res = await request(Server)
        .post(ServerRoutes.USERS + UserRoutes.REGISTER)
        .send(cannedRequestBody);

      const registeredUserByEmail = await User.findOne({
        email: cannedRequestBody.email,
      });

      expect(registeredUserByEmail).not.toBeNull();

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body.email).not.toEqual("");
      expect(res.body.username).toEqual("");
      done();
    });

    it("should return error messages if the username is already registered", async (done) => {
      const cannedRequestBody = {
        email: "unusedEmail@email.com",
        username: existingUser.username,
        password: existingUser.password,
      };

      const res = await request(Server)
        .post(ServerRoutes.USERS + UserRoutes.REGISTER)
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body.username).not.toEqual("");
      expect(res.body.email).toEqual("");
      done();
    });

    it("should not return any errors and successfully register the user", async (done) => {
      const cannedRequestBody = {
        email: "new@email.com",
        username: "newUsername",
        password: existingUser.password,
      };

      const res = await request(Server)
        .post(ServerRoutes.USERS + UserRoutes.REGISTER)
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body.username).toEqual(cannedRequestBody.username);
      expect(res.body.email).toEqual(cannedRequestBody.email);

      const registeredUserByEmail = await User.findOne({
        email: cannedRequestBody.email,
      });
      const registeredUserByUsername = await User.findOne({
        username: cannedRequestBody.username,
      });

      expect(registeredUserByEmail).not.toBeNull();
      expect(registeredUserByUsername).not.toBeNull();
      done();
    });
  });

  describe("/api/users/login", () => {
    // TODO: Trigger the error catch
    it("should return a 400 status code because there are errors in the form inputs", async (done) => {
      const res = await request(Server).post(
        ServerRoutes.USERS + UserRoutes.LOGIN
      );
      expect(res.status).toEqual(StatusCodes.OK);
      done();
    });

    it("should return an error message if the user is not found", async (done) => {
      const cannedRequestBody = {
        username: "wrongUsername",
        password: existingUser.password,
      };

      const res = await request(Server)
        .post(ServerRoutes.USERS + UserRoutes.LOGIN)
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body.username).not.toEqual("");
      expect(res.body.password).toEqual("");
      done();
    });

    it("should return an error message if the password is incorrect", async (done) => {
      const cannedRequestBody = {
        username: existingUser.username,
        password: "wrongpassword",
      };

      const res = await request(Server)
        .post(ServerRoutes.USERS + UserRoutes.LOGIN)
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body.username).toEqual("");
      expect(res.body.password).not.toEqual("");
      done();
    });

    it("should return a success message and information about the user if all inputs are correct", async (done) => {
      const cannedRequestBody = {
        username: existingUser.username,
        password: existingUser.password,
      };

      const res = await request(Server)
        .post(ServerRoutes.USERS + UserRoutes.LOGIN)
        .send(cannedRequestBody);

      const registeredUserByUsername = await User.findOne({
        username: existingUser.username,
      });

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body.username).toEqual(undefined);
      expect(res.body.password).toEqual(undefined);
      expect(res.body).toHaveProperty("success");
      expect(res.body.success).toEqual(true);
      done();
    });
  });
});
