import userFollowingPosts from "../../database/Post/getFollowingPostsByUserId.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

const getUserFollowingPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const followingPosts = await userFollowingPosts(userId, page);

  res.json(followingPosts);
});

export default getUserFollowingPost;
