import Post from "../../models/PostModel.js";

const getSinglePostDB = async (postId) => {
  if (!postId) {
    throw new Error("UserId or PostId is not provided");
  }

  const post = await Post.findOne({ _id: postId });

  return post;
};

export default getSinglePostDB;
