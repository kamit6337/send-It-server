import Reply from "../../models/ReplyModel.js";

const userReplyCount = async (userId) => {
  const count = await Reply.countDocuments({
    user: userId,
  });

  return count;
};

export default userReplyCount;
