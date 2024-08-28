import userFollowingPosts from "../../database/Follower/getFollowingPostsByUserId.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

const getUserFollowingPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const followingPosts = await userFollowingPosts(userId, { limit, skip });

  res.json({
    message: "user following posts",
    page,
    data: followingPosts,
  });
});

export default getUserFollowingPost;
