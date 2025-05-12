import Reply from "../../models/ReplyModel.js";

const deleteReplyByPostIdDB = async (postId) => {
  if (!postId) throw new Error("PostId is not provided");

  const response = await Reply.deleteMany({
    $or: [{ post: { $in: postId } }, { replyPost: postId }],
  });

  return response;
};

export default deleteReplyByPostIdDB;
