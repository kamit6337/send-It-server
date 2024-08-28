import Post from "../../models/PostModel.js";
import {
  getCachedPostDetails,
  setPostDetails,
} from "../../redis/Post/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const postDetails = catchAsyncDBError(async (postId) => {
  const cachedPostDetails = await getCachedPostDetails(postId);

  if (cachedPostDetails) return cachedPostDetails;

  const post = await Post.findOne({ _id: postId })
    .select("_id replyCount likeCount viewCount saveCount retweetCount")
    .lean();

  await setPostDetails(postId, post);

  return post;
});

export default postDetails;
