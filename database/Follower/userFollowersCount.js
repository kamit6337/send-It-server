import Follower from "../../models/FollowerModel.js";

const userFollowersCount = async (userId) => {
  const followerCount = await Follower.countDocuments({
    user: userId,
    follower: { $ne: userId },
  });

  return followerCount;
};

export default userFollowersCount;
