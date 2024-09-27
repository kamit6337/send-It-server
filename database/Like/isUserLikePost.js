import Like from "../../models/LikeModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const isUserLikePost = catchAsyncDBError(async (userId, postId) => {
  const liked = await Like.exists({ user: userId, post: postId });

  return !!liked;
});

export default isUserLikePost;
