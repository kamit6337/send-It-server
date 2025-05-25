import createPostDB from "../../../database/Post/createPostDB.js";
import Post from "../../../models/PostModel.js";

jest.mock("../../../models/PostModel.js", () => ({
  create: jest.fn(),
}));

describe("createPostDB", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("it return post if all parameteres is correct", async () => {
    const mockValue = { _id: "_id", message: "message" };

    Post.create.mockResolvedValue(mockValue);

    const validObject = {
      message: "message",
    };

    const result = await createPostDB(validObject);

    expect(Post.create).toHaveBeenCalledTimes(1);
    expect(Post.create).toHaveBeenCalledWith(validObject);
    expect(result).toEqual(mockValue);
  });

  it("it throw error when obj is not provided", async () => {
    await expect(createPostDB()).rejects.toThrow("Obj is not provided");
  });
});
