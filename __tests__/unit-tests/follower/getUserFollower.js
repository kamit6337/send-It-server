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
    json: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: SUCCESSFULLY RETURN DATA
it("successfuly return data", async () => {
  const userId = req.userId;
  const { id, page } = req.query;

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

  expect(getFollowersByUserId).toHaveBeenCalledWith(userId, id, page);

  expect(res.json).toHaveBeenCalledWith(followersData);
});

// NOTE: SUCCESSFULLY RETURN DATA FOR PAGE 2
it("successfully return data for page 2", async () => {
  req.query.page = 2;

  const userId = req.userId;
  const { id } = req.query;

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

  expect(getFollowersByUserId).toHaveBeenCalledWith(userId, id, 2);

  expect(res.json).toHaveBeenCalledWith(followersData);
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
