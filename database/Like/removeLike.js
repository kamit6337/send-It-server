import Like from "../../models/LikeModel.js";
import { updatePostLike } from "../../redis/Like/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const removeLike = catchAsyncDBError(async (userId, postId) => {
  await Like.deleteOne({ user: userId, post: postId });
  await updatePostLike(userId, postId, false);
});

export default removeLike;
