import getFollowingPostsByUserId from "../../../database/Post/getFollowingPostsByUserId.js";
import Follower from "../../../models/FollowerModel.js";

// Mock Mongoose aggregate
jest.mock("../../../models/FollowerModel.js", () => ({
  aggregate: jest.fn(),
}));

describe("getFollowingPostsByUserId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return posts when userId and page are valid", async () => {
    const mockPosts = [{ _id: "1", message: "Hello" }];
    Follower.aggregate.mockResolvedValue(mockPosts);

    const validObjectId = "507f1f77bcf86cd799439011"; // Valid ObjectId

    const result = await getFollowingPostsByUserId(validObjectId, 1);

    expect(Follower.aggregate).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockPosts);
  });

  it("should throw error when userId is missing", async () => {
    await expect(getFollowingPostsByUserId(null, 1)).rejects.toThrow(
      "UserId or page is not provided"
    );
  });

  it("should throw error when page is missing", async () => {
    await expect(getFollowingPostsByUserId("user123", null)).rejects.toThrow(
      "UserId or page is not provided"
    );
  });
});
