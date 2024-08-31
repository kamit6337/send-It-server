import catchAsyncError from "../../utils/catchAsyncError.js";
import userLikedPosts from "../../database/Like/userLikedPosts.js";

const getUserLikedPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const posts = await userLikedPosts(userId, { limit, skip });

  res.json(posts);
});

export default getUserLikedPost;
