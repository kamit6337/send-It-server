import Like from "../../../models/LikeModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";

const getPostLike = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId } = req.query;

  if (!postId) {
    return next(new HandleGlobalError("PostId is required", 404));
  }

  const liked = await Like.findOne({ user: userId, post: postId }).lean();

  res.json({
    message: "check whether post is liked by user or not",
    data: liked,
  });
});

export default getPostLike;
