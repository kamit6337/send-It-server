import Follower from "../../models/FollowerModel.js";

const userFollowingsCount = async (userId) => {
  const followingCount = await Follower.countDocuments({
    user: { $ne: userId },
    follower: userId,
  });

  return followingCount;
};

export default userFollowingsCount;
