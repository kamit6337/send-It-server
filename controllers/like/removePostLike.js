import Like from "../../models/LikeModel.js";
import Post from "../../models/PostModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { io } from "../../app.js";
import { v4 as uuidv4 } from "uuid";

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

  await Promise.all([like, decrease]);

  const obj = {
    _id: uuidv4(),
    user: userId,
    post: postId,
  };

  io.emit("removeLike", obj);

  res.json({
    message: "remove Like",
  });
});

export default removePostLike;
