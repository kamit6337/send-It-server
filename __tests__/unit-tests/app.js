import request from "supertest";
import httpServer from "../../app.js";

describe("Get Home Route", () => {
  let server;

  beforeAll((done) => {
    server = httpServer.listen(8000, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it("test hoem route", async () => {
    const response = await request(server).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: "Hello from the server" });
  });
});
