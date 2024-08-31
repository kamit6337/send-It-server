import Post from "../../models/PostModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const postDetails = catchAsyncDBError(async (postId) => {
  const post = await Post.findOne({ _id: postId })
    .select("_id replyCount likeCount viewCount saveCount retweetCount")
    .lean();

  return post;
});

export default postDetails;
