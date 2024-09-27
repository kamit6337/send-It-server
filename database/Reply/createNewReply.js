import Reply from "../../models/ReplyModel.js";

const createNewReply = async (userId, postId, replyPostId) => {
  const reply = await Reply.create({
    user: userId,
    post: postId,
    replyPost: replyPostId,
  });

  return reply;
};

export default createNewReply;
