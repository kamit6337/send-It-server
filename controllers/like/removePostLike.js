import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { v4 as uuidv4 } from "uuid";
import { removeLikeIO } from "../../socketIO/like.js";
import removeLike from "../../database/Like/removeLike.js";
import updatePostLikeCount from "../../database/Post/updatePostLikeCount.js";
import viewCountFunction from "../functions/viewCountFunction.js";

const removePostLike = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId } = req.query;

  if (!postId) {
    return next(new HandleGlobalError("PostId is required", 404));
  }

  const like = removeLike(userId, postId);

  const decrease = updatePostLikeCount(postId, -1);
  const viewCount = viewCountFunction(postId);

  await Promise.all([like, decrease, viewCount]);

  const obj = {
    _id: uuidv4(),
    user: userId,
    post: postId,
  };

  removeLikeIO(obj);

  res.json({
    message: "remove Like",
  });
});

export default removePostLike;
