import Post from "../../models/PostModel.js";

const getRepliesByPostIdDB = async (postId, page) => {
  if (!postId || !page) {
    throw new Error("PostId or page is not provided");
  }

  const limit = 10;
  const skip = (page - 1) * limit;

  const replies = await Post.find({
    replyPost: postId,
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return replies;
};

export default getRepliesByPostIdDB;
