import Post from "../../models/PostModel.js";

const userPostCount = async (userId) => {
  const count = await Post.countDocuments({
    user: userId,
    ofReply: false,
  });
  return count;
};

export default userPostCount;
