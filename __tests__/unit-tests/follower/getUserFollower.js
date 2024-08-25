import getUserFollower from "../../../controllers/follower/getUserFollower.js";
import getFollowersByUserId from "../../../database/Follower/getFollowersByUserId.js";

jest.mock("../../../database/Follower/getFollowersByUserId.js");

let req, res, next;

beforeEach(() => {
  req = {
    userId: "actualuserId",
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

// NOTE: SUCCESSFULLY RETURN DATA
it("successfuly return data", async () => {
  const followersData = [
    {
      _id: "someId",
      follower: {
        _id: "followerId",
        username: "followerUsername",
        name: "Follower Name",
        photo: "followerPhoto",
      },
      isActualUserFollow: true,
    },
    // Add more mocked followers as needed
  ];

  getFollowersByUserId.mockResolvedValue(followersData);

  await getUserFollower(req, res, next);

  expect(getFollowersByUserId).toHaveBeenCalledWith("actualuserId", "userId", {
    limit: 20,
    skip: 0,
  });

  expect(res.json).toHaveBeenCalledWith({
    message: "user followers",
    page: 1,
    data: followersData,
  });

  expect(next).not.toHaveBeenCalled();
});

// NOTE: SUCCESSFULLY RETURN DATA FOR PAGE 2
it("successfully return data for page 2", async () => {
  req.query.page = 2;

  const followersData = [
    {
      _id: "someId",
      follower: {
        _id: "followerId",
        username: "followerUsername",
        name: "Follower Name",
        photo: "followerPhoto",
      },
      isActualUserFollow: true,
    },
    // Add more mocked followers as needed
  ];

  getFollowersByUserId.mockResolvedValue(followersData);

  await getUserFollower(req, res, next);

  expect(getFollowersByUserId).toHaveBeenCalledWith("actualuserId", "userId", {
    limit: 20,
    skip: 20,
  });

  expect(res.json).toHaveBeenCalledWith({
    message: "user followers",
    page: 2,
    data: followersData,
  });

  expect(next).not.toHaveBeenCalled();
});

// NOTE: FAILED, ID IS NOT PRESENT
it("failed, id is not present", async () => {
  req.query = {};

  await getUserFollower(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Pleae provide user id",
    })
  );
});
