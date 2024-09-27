import Like from "../../models/LikeModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const createLike = catchAsyncDBError(async (userId, postId) => {
  await Like.create({ user: userId, post: postId });
});

export default createLike;
