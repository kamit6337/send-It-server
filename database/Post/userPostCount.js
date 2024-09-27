import Post from "../../models/PostModel.js";

const userPostCount = async (userId) => {
  const count = await Post.countDocuments({
    user: userId,
  });
  return count;
};

export default userPostCount;
