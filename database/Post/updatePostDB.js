import Post from "../../models/PostModel.js";

const updatePostDB = async (postId, obj) => {
  const post = await Post.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      ...obj,
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  return post;
};

export default updatePostDB;
