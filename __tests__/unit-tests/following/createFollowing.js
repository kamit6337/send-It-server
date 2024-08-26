import createFollowing from "../../../controllers/following/createFollowing.js";
import newFollowing from "../../../database/Follower/newFollowing.js";

jest.mock("../../../database/Follower/newFollowing.js");

let req, res, next;

beforeEach(() => {
  req = {
    userId: "userId",
    body: {
      id: "followingId",
    },
  };

  res = {
    status: jest.fn(() => res),
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

  newFollowing.mockResolvedValue(mockValue);

  await createFollowing(req, res, next);

  expect(newFollowing).toHaveBeenCalledWith("followingId", "userId");
  expect(res.json).toHaveBeenCalledWith({
    message: "New Following",
    data: mockValue,
  });
});

// NOTE: FAILED, DUE TO NOT PRESENT OF FOLLOWERID
it("failed, due to not presence of followerId", async () => {
  req.body = {};

  await createFollowing(req, res, next);

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({
      message: "Follwing ID must be provided",
    })
  );
});
