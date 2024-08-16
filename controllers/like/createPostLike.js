import Like from "../../models/LikeModel.js";
import Post from "../../models/PostModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { io } from "../../app.js";
import { v4 as uuidv4 } from "uuid";

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

  const obj = {
    _id: uuidv4(),
    user: userId,
    post: postId,
  };

  io.emit("newLike", obj);

  res.json({
    message: "Like the post",
  });
});

export default createPostLike;