import Post from "../../models/PostModel.js";

const userReplyCount = async (userId) => {
  const count = await Post.countDocuments({
    user: userId,
    replyPostId: { $ne: null },
  });

  return count;
};

export default userReplyCount;
