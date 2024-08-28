import Post from "../../models/PostModel.js";
import { getCachedUserPosts, setUserPosts } from "../../redis/Post/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const userPosts = catchAsyncDBError(async (userId, { limit, skip }) => {
  const cachedPosts = await getCachedUserPosts(userId, { limit, skip });

  if (cachedPosts) return cachedPosts;

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

  await setUserPosts(userId, posts);

  return posts;
});

export default userPosts;
