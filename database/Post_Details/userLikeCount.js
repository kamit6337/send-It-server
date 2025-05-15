import Like from "../../models/LikeModel.js";

const userLikeCount = async (userId) => {
  const count = Like.countDocuments({
    user: userId,
  });

  return count;
};

export default userLikeCount;
