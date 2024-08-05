import Like from "../../../models/LikeModel.js";
import Post from "../../../models/PostModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";

const removePostLike = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId } = req.query;

  if (!postId) {
    return next(new HandleGlobalError("PostId is required", 404));
  }

  const like = Like.deleteOne({ user: userId, post: postId });

  const decrease = Post.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: { likeCount: -1 },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  const [userDisLiked, decreaseLike] = await Promise.all([like, decrease]);

  res.json({
    message: "Like the post",
    data: {
      userDisLiked,
      decreaseLike,
    },
  });
});

export default removePostLike;
