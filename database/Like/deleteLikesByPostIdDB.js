import Like from "../../models/LikeModel.js";

const deleteLikesByPostIdDB = async (postId) => {
  if (!postId) throw new Error("PostId is not provided");

  const response = await Like.deleteMany({ post: postId });

  return response;
};

export default deleteLikesByPostIdDB;
