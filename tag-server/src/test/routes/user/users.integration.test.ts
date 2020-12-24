import request from "supertest";
import Server, { ServerRoutes } from "tag-server/app";
import { User } from "tag-server/models";
import { StatusCodes, UserRoutes } from "tag-server/routes/constants";

import { validateUsernameRegistration } from "tag-server/validation/routes/user/register";
import dbHandler from "tag-server-test/test-util/db-handler";

jest.mock("tag-server/validation/routes/user/register");

describe("Users Route", () => {
  beforeAll(async () => await dbHandler.connect());
  afterEach(async () => await dbHandler.clearDatabase());
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
    const validateUsernameRegistrationMock = validateUsernameRegistration as jest.MockedFunction<
      typeof validateUsernameRegistration
    >;

    // TODO: Trigger the error catch

    it("should return a 400 status code because there are errors in the form inputs", async (done) => {
      // Mock validation data instead of sending as body to speed up the process
      validateUsernameRegistrationMock.mockReturnValueOnce({
        errors: {
          email: "error!",
          username: "error!",
          password: "error!",
        },
        isValid: false,
      });

      const res = await request(Server).post(
        ServerRoutes.USERS + UserRoutes.REGISTER
      );

      expect(res.status).toEqual(StatusCodes.BAD_REQUEST);
      done();
    });

    it("should return error messages if the email is already registered", async (done) => {
      validateUsernameRegistrationMock.mockReturnValueOnce({
        errors: {},
        isValid: true,
      });

      const cannedRequestBody = {
        email: "test@email.com",
        username: "testUsername",
        password: "1234",
      };

      // Add a mock user to the database
      const newUser = new User({
        ...cannedRequestBody,
        username: "username",
      });
      newUser.save();

      const res = await request(Server)
        .post(ServerRoutes.USERS + UserRoutes.REGISTER)
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body.email).not.toEqual(undefined);
      expect(res.body.username).toEqual(undefined);
      done();
    });

    it("should return error messages if the username is already registered", async (done) => {
      validateUsernameRegistrationMock.mockReturnValueOnce({
        errors: {},
        isValid: true,
      });

      const cannedRequestBody = {
        email: "new@email.com",
        username: "testUsername",
        password: "1234",
      };

      // Add a mock user to the database
      const newUser = new User({
        ...cannedRequestBody,
        email: "existing@email.com",
      });
      newUser.save();

      const res = await request(Server)
        .post(ServerRoutes.USERS + UserRoutes.REGISTER)
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body.username).not.toEqual(undefined);
      expect(res.body.email).toEqual(undefined);
      done();
    });
  });
});
