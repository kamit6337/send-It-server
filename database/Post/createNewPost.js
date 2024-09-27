import catchAsyncDBError from "../../utils/catchAsyncDBError.js";
import Post from "../../models/PostModel.js";

const createNewPost = catchAsyncDBError(async (userId, obj) => {
  const post = await Post.create({
    user: userId,
    ...obj,
  });

  return post;
});

export default createNewPost;
