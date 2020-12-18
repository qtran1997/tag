import request from "supertest";
import { UserRoutes } from "tag-server/routes/constants";
import Server, {ServerRoutes} from "tag-server/app";

describe("Users Route", () => {
  describe("/api/users/test", () => {
    afterAll(() => {
      Server.close();
    })
    it("should return a 200 status code", async done => {
      // expect(true).toBe(true)
      const res = await request(Server).get(ServerRoutes.USERS + UserRoutes.TEST);
      expect(res.status).toEqual(200);
      done()
    });
    it("should return a 200 status code 2", async done => {
      // expect(true).toBe(true)
      const res = await request(Server).get(ServerRoutes.USERS + UserRoutes.TEST);
      expect(res.status).toEqual(200);
      done()
    });
  });
});
