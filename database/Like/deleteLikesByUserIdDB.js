import Like from "../../models/LikeModel.js";

const deleteLikesByUserIdDB = async (userId, postId) => {
  if (!userId || !postId) {
    throw new Error("UserId or PostId is not provided");
  }

  const checkAlreadyLike = await Like.exists({ user: userId, post: postId });

  if (!checkAlreadyLike) throw new Error("Post is not liked by User");

  const response = await Like.deleteMany({ user: userId, post: postId });

  return response;
};

export default deleteLikesByUserIdDB;
