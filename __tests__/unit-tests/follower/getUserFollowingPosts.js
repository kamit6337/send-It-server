import getUserFollowingPost from "../../../controllers/following/getUserFollowingPost.js";
import userFollowingPosts from "../../../database/Follower/getFollowingsByUserId.js";

jest.mock("../../../database/Follower/getFollowingsByUserId.js");

let req, res, next;

beforeEach(() => {
  req = {
    userId: "userId",
    query: {
      page: 1,
    },
  };

  res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  next = jest.fn();
});

// NOTE: GET USER FOLLOWING POSTS SUCCESSFULLY
it("get user following posts successfully", async () => {
  const mockData = [
    {
      "user.username": "username",
      "user.name": "name",
      "user.photo": "photo",
      _id: "postId",
      message: "message",
      media: "media",
    },
  ];

  userFollowingPosts.mockResolvedValue(mockData);

  await getUserFollowingPost(req, res, next);

  expect(userFollowingPosts).toHaveBeenCalledWith("userId", {
    limit: 20,
    skip: 0,
  });

  expect(res.json).toHaveBeenCalledWith({
    message: "user following posts",
    page: 1,
    data: mockData,
  });
});

// NOTE: GET USER FOLLOWING POSTS SUCCESSFULLY PAGE 2
it("get user following posts successfully page 2", async () => {
  req.query.page = 2;

  const mockData = [
    {
      "user.username": "username",
      "user.name": "name",
      "user.photo": "photo",
      _id: "postId",
      message: "message",
      media: "media",
    },
  ];

  userFollowingPosts.mockResolvedValue(mockData);

  await getUserFollowingPost(req, res, next);

  expect(userFollowingPosts).toHaveBeenCalledWith("userId", {
    limit: 20,
    skip: 20,
  });

  expect(res.json).toHaveBeenCalledWith({
    message: "user following posts",
    page: 2,
    data: mockData,
  });
});
