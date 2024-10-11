import getUserFollowing from "../../../controllers/following/getUserFollowing.js";
import getFollowingsByUserId from "../../../database/Follower/getFollowingsByUserId.js";

jest.mock("../../../database/Follower/getFollowingsByUserId.js");

let req, res, next;

beforeEach(() => {
  req = {
    userId: "actualUserId",
    query: {
      id: "userId",
      page: 1,
    },
  };

  res = {
    json: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: GETTING USER FOLLOWING SUCCESSFULLY
it("getting user following successfully", async () => {
  const mockValue = [
    {
      _id: "objectId",
      follower: "followerId",
      user: "userId",
    },
  ];

  getFollowingsByUserId.mockResolvedValue(mockValue);

  await getUserFollowing(req, res, next);

  expect(getFollowingsByUserId).toHaveBeenCalledWith(
    "userId",
    "actualUserId",
    1
  );

  expect(res.json).toHaveBeenCalledWith(mockValue);
});

// NOTE: GETTING USER FOLLOWING SUCCESSFULLY FOR PAGE 2
it("getting user following successfully for page 2", async () => {
  const mockValue = [
    {
      _id: "objectId",
      follower: "followerId",
      user: "userId",
    },
  ];

  req.query.page = 2;

  getFollowingsByUserId.mockResolvedValue(mockValue);

  await getUserFollowing(req, res, next);

  expect(getFollowingsByUserId).toHaveBeenCalledWith(
    "userId",
    "actualUserId",
    2
  );

  expect(res.json).toHaveBeenCalledWith(mockValue);
});

// NOTE: FAILED, DUE TO NOT PRESENT OF ID
it("failed, due to not present of Id", async () => {
  req.query = {};

  await getUserFollowing(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Pleae provide user id",
    })
  );
});
