import userPosts from "../../database/Post/userPosts.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getUserPost = catchAsyncError(async (req, res, next) => {
  const { page = 1, id } = req.query;

  if (!id) {
    return next(HandleGlobalError("Id needs to be provided", 403));
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const posts = await userPosts(id, { limit, skip });

  res.json({
    message: "user posts",
    page,
    data: posts,
  });
});

export default getUserPost;
