import Post from "../../models/PostModel.js";

const deletePostDB = async (postId) => {
  if (!postId) throw new Error("PostId is not provided");

  const response = await Post.deleteOne({
    _id: postId,
  });

  return response;
};

export default deletePostDB;
