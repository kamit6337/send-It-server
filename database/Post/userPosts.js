import Post from "../../models/PostModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const userPosts = catchAsyncDBError(async (userId, page) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  const posts = await Post.find({
    user: userId,
    ofReply: false,
  })
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .populate({
      path: "user",
      select: "_id name username photo",
    });

  return posts;
});

export default userPosts;
