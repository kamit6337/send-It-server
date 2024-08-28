import Post from "../../models/PostModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const updatePostLikeCount = catchAsyncDBError(async (postId, amount) => {
  await Post.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: { likeCount: amount },
    },
    {
      new: true,
      runValidators: true,
    }
  );
});

export default updatePostLikeCount;
