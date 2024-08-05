import Post from "../../../models/PostModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";

const getUserPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const posts = await Post.find({
    user: userId,
  })
    .sort("-updatedAt")
    .skip(skip)
    .limit(limit);

  res.json({
    message: "user posts",
    page,
    data: posts,
  });
});

export default getUserPost;
