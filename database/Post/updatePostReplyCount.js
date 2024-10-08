import Post from "../../models/PostModel.js";

const updatePostReplyCount = async (postId, amount = 1) => {
  await Post.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: { replyCount: amount },
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

export default updatePostReplyCount;
