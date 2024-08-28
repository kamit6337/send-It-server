import userFollowingPosts from "../../database/Post/getFollowingPostsByUserId.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

const getUserFollowingPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const followingPosts = await userFollowingPosts(userId, { limit, skip });

  res.json(followingPosts);
});

export default getUserFollowingPost;
