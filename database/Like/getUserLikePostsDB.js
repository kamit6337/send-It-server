import Like from "../../models/LikeModel.js";

const getUserLikePostsDB = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserID or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const likePosts = await Like.find({
    user: userId,
  })
    .sort("-updatedAt")
    .skip(skip)
    .limit(limit)
    .lean();

  return likePosts;
};

export default getUserLikePostsDB;
