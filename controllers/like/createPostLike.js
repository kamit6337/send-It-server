import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { v4 as uuidv4 } from "uuid";
import { sendNewLikeIO } from "../../socketIO/like.js";
import createLike from "../../database/Like/createLike.js";
import updatePostLikeCount from "../../database/Post/updatePostLikeCount.js";

const createPostLike = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId, user: postUserId } = req.body;

  if (!postId || !postUserId) {
    return next(new HandleGlobalError("PostId is required", 404));
  }

  const increase = updatePostLikeCount(postId, 1);
  const like = createLike(userId, postId);

  await Promise.all([like, increase]);

  const obj = {
    _id: uuidv4(),
    user: userId,
    post: postId,
  };

  sendNewLikeIO(obj);

  res.json({
    message: "Like the post",
  });
});

export default createPostLike;
