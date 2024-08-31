import Like from "../../models/LikeModel.js";
import { checkPostLike, createPostLike } from "../../redis/Like/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const isUserLikePost = catchAsyncDBError(async (userId, postId) => {
  // const checkLike = await checkPostLike(userId, postId);

  // if (checkLike) {
  //   return checkLike.isLiked;
  // }

  const liked = await Like.exists({ user: userId, post: postId });

  // await createPostLike(userId, postId, !!liked);

  return !!liked;
});

export default isUserLikePost;
