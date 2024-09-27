import Like from "../../models/LikeModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const removeLike = catchAsyncDBError(async (userId, postId) => {
  await Like.deleteOne({ user: userId, post: postId });
});

export default removeLike;
