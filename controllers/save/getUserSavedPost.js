import userSavedPosts from "../../database/Save/userSavedPosts.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

const getUserSavedPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const posts = await userSavedPosts(userId, page);

  res.json(posts);
});
export default getUserSavedPost;
