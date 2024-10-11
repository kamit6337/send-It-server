import userFollowingPosts from "../../../database/Post/getFollowingPostsByUserId.js";
import getUserFollowingPost from "../../../controllers/following/getUserFollowingPost.js";

jest.mock("../../../database/Post/getFollowingPostsByUserId.js");

let req, res, next;

beforeEach(() => {
  req = {
    userId: "userId",
    query: {
      page: 1,
    },
  };

  res = {
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

  expect(userFollowingPosts).toHaveBeenCalledWith("userId", 1);

  expect(res.json).toHaveBeenCalledWith(mockData);
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

  expect(userFollowingPosts).toHaveBeenCalledWith("userId", 2);

  expect(res.json).toHaveBeenCalledWith(mockData);
});
