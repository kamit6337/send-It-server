import Post from "../../models/PostModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const updatePostSaveCount = catchAsyncDBError(async (postId, amount) => {
  await Post.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: { saveCount: amount },
    },
    {
      new: true,
      runValidators: true,
    }
  );
});

export default updatePostSaveCount;
