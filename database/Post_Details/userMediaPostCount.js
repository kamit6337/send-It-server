import Post from "../../models/PostModel.js";

const userMediaPostCount = async (userId) => {
  const count = await Post.countDocuments({
    user: userId,
    media: { $ne: "" },
  });

  return count;
};

export default userMediaPostCount;
