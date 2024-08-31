import Like from "../../models/LikeModel.js";
// import { updatePostLike } from "../../redis/Like/checkExistsAndUpdate.js";
// import { delSingleUserLikedPost } from "../../redis/Like/likedPosts.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const removeLike = catchAsyncDBError(async (userId, postId) => {
  await Like.deleteOne({ user: userId, post: postId });

  // await delSingleUserLikedPost(userId, postId);

  // await updatePostLike(userId, postId, false);
});

export default removeLike;
