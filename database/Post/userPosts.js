import Post from "../../models/PostModel.js";
// import { getCachedUserPosts, setUserPosts } from "../../redis/Post/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const userPosts = catchAsyncDBError(async (userId, page) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  // const cachedPosts = await getCachedUserPosts(page);
  // if (cachedPosts) return cachedPosts;

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

  // await setUserPosts(page, posts);

  return posts;
});

export default userPosts;
