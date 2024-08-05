import Like from "../../../models/LikeModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";

const getPostLike = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId } = req.query;

  if (!postId) {
    return next(new HandleGlobalError("PostId is required", 404));
  }

  const isLiked = await Like.exists({ user: userId, post: postId });

  res.json({
    message: "check whether post is liked by user or not",
    data: !!isLiked,
  });
});

export default getPostLike;
