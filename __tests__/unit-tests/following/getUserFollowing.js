import getUserFollowing from "../../../controllers/following/getUserFollowing.js";
import userFollowings from "../../../database/Follower/userFollowings.js";

jest.mock("../../../database/Follower/userFollowings.js");

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
    status: jest.fn(() => res),
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

  userFollowings.mockResolvedValue(mockValue);

  await getUserFollowing(req, res, next);

  expect(userFollowings).toHaveBeenCalledWith("userId", "actualUserId", {
    limit: 20,
    skip: 0,
  });

  expect(res.json).toHaveBeenCalledWith({
    message: "user following",
    page: 1,
    data: mockValue,
  });
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

  userFollowings.mockResolvedValue(mockValue);

  await getUserFollowing(req, res, next);

  expect(userFollowings).toHaveBeenCalledWith("userId", "actualUserId", {
    limit: 20,
    skip: 20,
  });

  expect(res.json).toHaveBeenCalledWith({
    message: "user following",
    page: 2,
    data: mockValue,
  });
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
