import deletePostDB from "../../../database/Post/deletePostDB.js";
import Post from "../../../models/PostModel.js";

jest.mock("../../../models/PostModel.js", () => ({
  deleteOne: jest.fn(),
}));

describe("deletePostDB", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deleted Post sucessfully when postId provided", async () => {
    const mockValue = { _id: "_id" };

    Post.deleteOne.mockResolvedValue(mockValue);

    const postId = "postId";

    const result = await deletePostDB(postId);

    expect(Post.deleteOne).toHaveBeenCalledTimes(1);
    expect(Post.deleteOne).toHaveBeenCalledWith({ _id: postId });
    expect(result).toEqual(mockValue);
  });
});
