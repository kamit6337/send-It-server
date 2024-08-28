import Like from "../../models/LikeModel.js";
import { updatePostLike } from "../../redis/Like/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const createLike = catchAsyncDBError(async (userId, postId) => {
  await Like.create({ user: userId, post: postId });
  await updatePostLike(userId, postId, true);
});

export default createLike;
