import Post from "../../models/PostModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const createPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { message = "", media = "" } = req.body;

  if (!message && !media) {
    return next(new HandleGlobalError("All fields is required", 404));
  }

  const post = await Post.create({
    user: userId,
    message,
    media,
  });

  res.json({
    message: "Post created",
    data: post,
  });
});

export default createPost;
