import request from "supertest";
import Server, { ServerRoutes } from "tag-server/app";
import hashString from "tag-server/config/hashString";
import { User, UserLinks } from "tag-server/models";
import { StatusCodes, UserRoutes } from "tag-server/routes/constants";
import dbHandler from "tag-server-test/test-util/db-handler";

describe("Users Route", () => {
  const existingUser = {
    email: "existing@email.com",
    username: "testUsername",
    password: "123456",
  };

  const user2 = {
    email: "user2@email.com",
    username: "username2",
    password: "123456",
  };

  const existingUserLinks = {
    facebook: "existingfacebook.com",
  };

  beforeAll(async () => {
    await dbHandler.connect();

    // Add a mock user to the database
    const newUser = new User({
      ...existingUser,
      password: await hashString(existingUser.password),
    });
    const newUser2 = new User({
      ...user2,
      password: await hashString(existingUser.password),
    });

    const savedUser = await newUser.save();
    const savedUser2 = await newUser2.save();

    const newUserLinks = new UserLinks({
      ...existingUserLinks,
      user_id: savedUser._id,
    });

    const savedUserLink = await newUserLinks.save();
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

    it("should return a 200 status code because there are errors in the form inputs", async (done) => {
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

  describe("/api/users/register/links", () => {
    // TODO: Trigger the error catch

    it("should return an error if the user is not logged in", async (done) => {
      const cannedRequestBody = {};

      const res = await request(Server)
        .post(ServerRoutes.USERS + UserRoutes.REGISTER_LINKS)
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.UNAUTHORIZED);
      done();
    });

    it("should return a new UserLink if the the user links have not been registered yet", async (done) => {
      const cannedRequestBody = {
        facebook: "facebook.com/test",
      };

      const loggedInServer = request.agent(Server);

      const loginRes = await loggedInServer
        .post(ServerRoutes.USERS + UserRoutes.LOGIN)
        .send(user2);
      const authToken = loginRes.body.token;

      const res = await loggedInServer
        .post(ServerRoutes.USERS + UserRoutes.REGISTER_LINKS)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);

      expect(res.body.facebook).toEqual(cannedRequestBody.facebook);

      const registeredUserByEmail = await User.findOne({
        email: user2.email,
      });

      const userId = registeredUserByEmail?.id;

      const userLinks = await UserLinks.findOne({ user_id: userId });

      expect(userLinks).not.toBeNull();
      expect(userLinks?.facebook).toEqual(cannedRequestBody.facebook);
      done();
    });

    it("should return a success message when successfully updating an existing user link", async (done) => {
      const cannedRequestBody = {
        facebook: "facebook.com/test",
      };

      const registeredUserByEmail = await User.findOne({
        email: existingUser.email,
      });

      const userId = registeredUserByEmail?.id;

      const userLinksInitial = await UserLinks.findOne({ user_id: userId });

      expect(userLinksInitial).not.toBeNull();

      const loggedInServer = request.agent(Server);

      const loginRes = await loggedInServer
        .post(ServerRoutes.USERS + UserRoutes.LOGIN)
        .send(existingUser);
      const authToken = loginRes.body.token;

      const res = await loggedInServer
        .post(ServerRoutes.USERS + UserRoutes.REGISTER_LINKS)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);

      const userLinksAfter = await UserLinks.findOne({ user_id: userId });

      expect(userLinksAfter).not.toBeNull();
      expect(userLinksAfter?.facebook).toEqual(cannedRequestBody.facebook);
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

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body.username).toEqual(undefined);
      expect(res.body.password).toEqual(undefined);
      expect(res.body).toHaveProperty("success");
      expect(res.body.success).toEqual(true);
      done();
    });
  });
});
