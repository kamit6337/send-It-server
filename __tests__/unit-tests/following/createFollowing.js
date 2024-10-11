import createFollowing from "../../../controllers/following/createFollowing.js";
import amIFollowThisUser from "../../../database/Follower/amIFollowThisUser.js";
import newFollowing from "../../../database/Follower/newFollowing.js";
import { v4 as uuid } from "uuid";
import { sendNewFollowingIO } from "../../../socketIO/following.js";

jest.mock("../../../database/Follower/newFollowing.js");
jest.mock("../../../database/Follower/amIFollowThisUser.js");
jest.mock("../../../socketIO/following.js");
jest.mock("uuid");

let req, res, next;

beforeEach(() => {
  req = {
    user: { name: "amit" },
    userId: "userId",
    body: {
      id: "followingId",
      username: "username",
    },
  };

  res = {
    json: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: CREATE FOLLOWING SUCCESSFULLY
it("create following successfully", async () => {
  const mockValue = {
    _id: "objectId",
    follower: "followerId",
    user: "userId",
  };

  amIFollowThisUser.mockResolvedValueOnce(false);
  amIFollowThisUser.mockResolvedValueOnce(true);
  newFollowing.mockResolvedValue(mockValue);
  uuid.mockReturnValue("new-uuid");

  await createFollowing(req, res, next);

  expect(amIFollowThisUser).toHaveBeenCalledWith("followingId", "userId");
  expect(amIFollowThisUser).toHaveBeenCalledWith("userId", "followingId");
  expect(newFollowing).toHaveBeenCalledWith("followingId", "userId");

  const obj = {
    _id: "new-uuid",
    user: {
      _id: "followingId",
      username: "username",
    },
    follower: { name: "amit" },
    isActualUserFollow: true,
  };

  expect(sendNewFollowingIO).toHaveBeenCalledWith(obj);

  expect(res.json).toHaveBeenCalledWith({
    message: "New Following",
  });
});

// NOTE: FAILED, DUE TO NOT PRESENT OF FOLLOWERID OR USERNAME
it("failed, due to not presence of followerId or username", async () => {
  req.body = {};

  await createFollowing(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Following ID must be provided",
    })
  );
});

// NOTE: FAILED, DUE TO I AM ALREADY FOLLOW THIS USER
it("failed, due to already follow this user", async () => {
  amIFollowThisUser.mockResolvedValue(true);

  await createFollowing(req, res, next);

  expect(amIFollowThisUser).toHaveBeenCalledWith("followingId", "userId");

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "You already follow this user",
    })
  );
});
