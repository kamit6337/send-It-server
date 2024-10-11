import request from "supertest";
import { decrypt } from "../../../utils/encryption/encryptAndDecrypt.js";
import getUserById from "../../../database/User/getUserById.js";
import singlePost from "../../../database/Post/singlePost.js";
import { app } from "../../../app.js";

jest.mock("../../../utils/encryption/encryptAndDecrypt.js");
jest.mock("../../../database/User/getUserById.js");
jest.mock("../../../database/Post/singlePost.js");

let token;

beforeEach(() => {
  token = "mocked-encrypted-token";

  decrypt.mockReturnValue({ id: "mockedUserId" });

  getUserById.mockResolvedValue({
    _id: "mockedUserId",
    username: "testuser",
    name: "Test User",
    photo: "test-photo-url",
  });

  singlePost.mockResolvedValue({
    _id: "mockedPostId",
    message: "This is a test post",
    media: "test-media-url",
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      _id: "mockedUserId",
      username: "testuser",
      name: "Test User",
      photo: "test-photo-url",
    },
    isFollow: false,
  });
});

it("return single post after user is authenticated", async () => {
  const response = await request(app)
    .get("/post")
    .set("Cookie", `_use=${token}`)
    .query({ id: "mockedPostId" });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({
    _id: "mockedPostId",
    message: "This is a test post",
    media: "test-media-url",
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
    user: {
      _id: "mockedUserId",
      username: "testuser",
      name: "Test User",
      photo: "test-photo-url",
    },
    isFollow: false,
  });
});

it("failed, any token is not present", async () => {
  const response = await request(app)
    .get("/post")
    .query({ id: "mockedPostId" });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "Your do not have active session. Please Login"
  );
});

it("failed, _use token is not present", async () => {
  const response = await request(app)
    .get("/post")
    .set("Cookie", `_sig=${token}`)
    .query({ id: "mockedPostId" });

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Please Login Again...");
});

it("failed, postId is not provided", async () => {
  const response = await request(app)
    .get("/post")
    .set("Cookie", `_use=${token}`);

  expect(response.status).toBe(404);
  expect(response.body.message).toBe("Id is not provided");
});

afterEach(() => {
  jest.clearAllMocks(); // Clear all mocks to avoid any lingering effects
});
