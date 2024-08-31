import Post from "../../models/PostModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const userMediaPosts = catchAsyncDBError(async (userId, page) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  const mediaPosts = await Post.find({
    user: userId,
    ofReply: false,
    media: { $ne: "" },
  })
    .skip(skip)
    .limit(limit);

  return mediaPosts;
});

export default userMediaPosts;
