import Post from "../../models/PostModel.js";

const getRepliesByPostIdDB = async (postId, page) => {
  if (!postId || !page) {
    throw new Error("PostId or page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const replies = await Post.find({
    replyPostId: postId,
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "user",
      select: "_id name email photo",
    })
    .lean();

  return replies;
};

export default getRepliesByPostIdDB;
