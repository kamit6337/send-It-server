import Like from "../../models/LikeModel.js";

const createNewLikeDB = async (userId, postId) => {
  if (!userId || !postId) {
    throw new Error("UserId or PostId is not provided");
  }

  const checkAlreadyLike = await Like.exists({ user: userId, post: postId });

  if (checkAlreadyLike) throw new Error("Already like the post");

  const newLike = await Like.create({ user: userId, post: postId });

  return newLike;
};

export default createNewLikeDB;
