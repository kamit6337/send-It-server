import Reply from "../../models/ReplyModel.js";

const getReplyByReplyPostID = async (postId) => {
  const findReply = await Reply.findOne({ replyPost: postId }).lean();
  return findReply;
};

export default getReplyByReplyPostID;
