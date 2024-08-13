import Like from "../../../models/LikeModel.js";
import Post from "../../../models/PostModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";

const createPostLike = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId } = req.body;

  if (!postId) {
    return next(new HandleGlobalError("PostId is required", 404));
  }

  const like = Like.create({ user: userId, post: postId });
  const increase = Post.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: { likeCount: 1 },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  await Promise.all([like, increase]);

  res.json({
    message: "Like the post",
  });
});

export default createPostLike;
