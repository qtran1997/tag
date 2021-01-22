import request from "supertest";
import Server from "tag-server/app";
import {
  FriendStatus,
  ServerRoutes,
  StatusCodes
} from "tag-server/common/constants";
import { FriendModel, UserModel } from "tag-server/common/types";
import { randomString } from "tag-server/common/util";
import hashString from "tag-server/config/hashString";
import { Friend, User } from "tag-server/models";
import { FriendRoutes, UserRoutes } from "tag-server/routes/constants";
import dbHandler from "tag-server-test/test-util/db-handler";

describe("Friends Route", () => {
  const requesterUser = {
    email: "existing@email.com",
    username: "requesterUsername",
    password: "123456"
  };

  let recipientUsers: setUpFriendIds = {};

  let loggedInServer: request.SuperAgentTest;
  let authToken: string;
  beforeAll(async () => {
    await dbHandler.connect();

    recipientUsers = await setUpFriendsDB(requesterUser);

    loggedInServer = request.agent(Server);
    const loginRes = await loggedInServer
      .post(ServerRoutes.USERS + UserRoutes.LOGIN)
      .send(requesterUser);
    authToken = loginRes.body.token;
  });
  // afterEach(async () => await dbHandler.clearDatabase());
  afterAll(async () => {
    await dbHandler.closeDatabase();
    Server.close();
  });

  describe(ServerRoutes.FRIENDS + FriendRoutes.TEST, () => {
    it("should return a 200 status code", async (done) => {
      const res = await request(Server).get(
        ServerRoutes.USERS + FriendRoutes.TEST
      );
      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty("msg");
      done();
    });
  });

  describe(ServerRoutes.FRIENDS + FriendRoutes.SEND, () => {
    it("should return an error if the user is not logged in", async (done) => {
      const cannedRequestBody = {};

      const res = await request(Server)
        .post(ServerRoutes.FRIENDS + FriendRoutes.SEND)
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.UNAUTHORIZED);
      done();
    });

    it("should return an error if the recipient user does not exist", async (done) => {
      const cannedRequestBody = {
        id: "5ff5635efa3b9c89d494e7c4"
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.SEND)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty("err");
      // TODO: TEST INTL
      done();
    });

    it("should return an error if the recipient user has already received a request from requester user", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.requestedUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.SEND)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty("err");
      expect(res.body.err).toEqual(`${FriendStatus.REQUESTED}`);
      // TODO: TEST INTL
      done();
    });

    it("should return an error if the request is pending. no way this should occur", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.pendingUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.SEND)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty("err");
      // TODO: TEST INTL
      done();
    });

    it("should return an error if the recipient user is already friends with requester user", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.alreadyFriendsUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.SEND)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty("err");
      expect(res.body.err).toEqual(`${FriendStatus.FRIENDS}`);
      // TODO: TEST INTL
      done();
    });

    it("should return an error if the recipient user does not exist", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.requestedUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.SEND)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty("err");
      // TODO: TEST INTL
      done();
    });

    it("should return a success message even if the recipient user does not have a friend document", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.noFriendDocUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.SEND)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).not.toHaveProperty("err");
      expect(res.body).toHaveProperty("success");
      // TODO: TEST INTL
      done();
    });

    it("should return a success message even if the recipient user already has a friend document", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.newFriendUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.SEND)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).not.toHaveProperty("err");
      expect(res.body).toHaveProperty("success");
      // TODO: TEST INTL
      done();
    });
  });

  describe(ServerRoutes.FRIENDS + FriendRoutes.ACCEPT, () => {
    it("should return an error if the user is not logged in", async (done) => {
      const cannedRequestBody = {};

      const res = await request(Server)
        .post(ServerRoutes.FRIENDS + FriendRoutes.ACCEPT)
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.UNAUTHORIZED);
      done();
    });

    it("should return an error if the user that sent the friend request does not exist", async (done) => {
      const cannedRequestBody = {
        id: "5ff5635efa3b9c89d494e7c4"
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.ACCEPT)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty("err");
      // TODO: TEST INTL
      done();
    });

    it("should create a friend document for the user if it does not exist but return an error because there no existing friend request", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.noFriendDocUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.ACCEPT)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty("err");
      // TODO: TEST INTL
      done();
    });

    it("should return an error if the request status is 'pending'. Can't accept a friend request that you requested", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.pendingUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.ACCEPT)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty("err");
      expect(res.body.err).toEqual(`${FriendStatus.PENDING}`);
      // TODO: TEST INTL
      done();
    });

    it("should return an error if the recipient user is already friends with requested user", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.alreadyFriendsUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.ACCEPT)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty("err");
      expect(res.body.err).toEqual(`${FriendStatus.FRIENDS}`);
      // TODO: TEST INTL
      done();
    });

    it("should successfully add each of the users as friends", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.requestedUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.ACCEPT)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).not.toHaveProperty("err");
      expect(res.body).toHaveProperty("success");

      // Check if users were added to each other's friends list
      const requesterUserDoc = await User.findOne({
        email: requesterUser.email
      });
      const recipientUserDoc = await User.findById(cannedRequestBody.id);

      expect(requesterUserDoc?.friends.includes(recipientUserDoc?._id)).toEqual(
        true
      );
      expect(recipientUserDoc?.friends.includes(requesterUserDoc?._id)).toEqual(
        true
      );
      // TODO: TEST INTL
      done();
    });
  });

  describe(ServerRoutes.FRIENDS + FriendRoutes.REMOVE, () => {
    it("should return an error if the user is not logged in", async (done) => {
      const cannedRequestBody = {};

      const res = await request(Server)
        .post(ServerRoutes.FRIENDS + FriendRoutes.REMOVE)
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.UNAUTHORIZED);
      done();
    });

    it("should return an error if the users are not friends", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.pendingUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.REMOVE)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).toHaveProperty("err");
      done();
    });

    it("should successfully remove each other from their friends lists", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.alreadyFriendsUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.REMOVE)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).not.toHaveProperty("err");
      expect(res.body).toHaveProperty("success");

      // Check if users were added to each other's friends list
      const requesterUserDoc = await User.findOne({
        email: requesterUser.email
      });
      const recipientUserDoc = await User.findById(cannedRequestBody.id);

      expect(requesterUserDoc?.friends.includes(recipientUserDoc?._id)).toEqual(
        false
      );
      expect(recipientUserDoc?.friends.includes(requesterUserDoc?._id)).toEqual(
        false
      );
      // TODO: TEST INTL
      done();
    });
  });
  describe(ServerRoutes.FRIENDS + FriendRoutes.DENY, () => {
    it("should return an error if the user is not logged in", async (done) => {
      const cannedRequestBody = {};

      const res = await request(Server)
        .post(ServerRoutes.FRIENDS + FriendRoutes.DENY)
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.UNAUTHORIZED);
      done();
    });

    it("should set decline the friend request both documents should revert to normal", async (done) => {
      const cannedRequestBody = {
        id: recipientUsers.requestedUserId
      };

      const res = await loggedInServer
        .post(ServerRoutes.FRIENDS + FriendRoutes.DENY)
        .auth(authToken, { type: "bearer" })
        .send(cannedRequestBody);

      expect(res.status).toEqual(StatusCodes.OK);
      expect(res.body).not.toHaveProperty("err");
      expect(res.body).toHaveProperty("success");

      // Check if users were added to each other's friends list
      const requesterUserDoc = await User.findOne({
        email: requesterUser.email
      });
      const recipientUserDoc = await User.findById(cannedRequestBody.id);

      expect(requesterUserDoc?.friends.includes(recipientUserDoc?._id)).toEqual(
        false
      );
      expect(recipientUserDoc?.friends.includes(requesterUserDoc?._id)).toEqual(
        false
      );
      // TODO: TEST INTL
      done();
    });
  });
});

type setUpFriendIds = {
  pendingUserId?: string;
  requestedUserId?: string;
  alreadyFriendsUserId?: string;
  newFriendUserId?: string;
  noFriendDocUserId?: string;
};

type setUpFriendsDBFunc = (requesterUser: {
  email: string;
  username: string;
  password: string;
}) => Promise<setUpFriendIds>;

const setUpFriendsDB: setUpFriendsDBFunc = async (requesterUser) => {
  const newRequesterUser = new User({
    ...requesterUser,
    password: await hashString(requesterUser.password)
  });
  const savedRequesterUser = await newRequesterUser.save();

  const pendingUserId = await createFriendDocument(
    savedRequesterUser,
    FriendStatus.PENDING
  );
  const requestedUserId = await createFriendDocument(
    savedRequesterUser,
    FriendStatus.REQUESTED
  );
  const alreadyFriendsUserId = await createFriendDocument(
    savedRequesterUser,
    FriendStatus.FRIENDS
  );
  const newFriendUserId = await createFriendDocument(
    savedRequesterUser,
    FriendStatus.ADD_FRIEND
  );
  const noFriendDocUserId: string = await createUserDocument();

  return {
    pendingUserId,
    requestedUserId,
    alreadyFriendsUserId,
    newFriendUserId,
    noFriendDocUserId
  };
};

type createFriendDocumentFunc = (
  requestUser: UserModel,
  status: FriendStatus
) => Promise<string>;

const createFriendDocument: createFriendDocumentFunc = async (
  requestUser,
  status
) => {
  let recipientUserId = "";
  try {
    recipientUserId = await createUserDocument();
    if (status === FriendStatus.ADD_FRIEND) {
      const requesterFriendDoc = await new Friend({
        requester: requestUser._id,
        recipient: recipientUserId,
        status: FriendStatus.ADD_FRIEND
      }).save();
    } else if (status === FriendStatus.REQUESTED) {
      const requesterFriendDoc = await new Friend({
        requester: requestUser._id,
        recipient: recipientUserId,
        status: FriendStatus.PENDING
      }).save();
    } else if (status === FriendStatus.PENDING) {
      const requesterFriendDoc = await new Friend({
        requester: requestUser._id,
        recipient: recipientUserId,
        status: FriendStatus.REQUESTED
      }).save();
    } else if (status === FriendStatus.FRIENDS) {
      const requesterFriendDoc = await new Friend({
        requester: requestUser._id,
        recipient: recipientUserId,
        status: FriendStatus.FRIENDS
      }).save();
    }

    const recipientFriendDoc = await new Friend({
      requester: recipientUserId,
      recipient: requestUser._id,
      status
    }).save();

    return recipientUserId;
  } catch (err) {
    console.log(err);
  }

  return recipientUserId;
};

type createUserDocumentFunc = () => Promise<string>;

const createUserDocument: createUserDocumentFunc = async () => {
  const randomEmail = randomString(8) + "@email.com";
  const randomUsername = randomString(8);
  const randomPassword = randomString(8);

  try {
    const recipientUser = await new User({
      email: randomEmail,
      username: randomUsername,
      password: await hashString(randomPassword)
    }).save();

    return recipientUser._id;
  } catch (err) {
    console.log(err);
  }
};
