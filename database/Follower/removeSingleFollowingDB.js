import Follower from "../../models/FollowerModel.js";

const removeSingleFollowingDB = async (currentUserId, followingUserId) => {
  if (!currentUserId || !followingUserId) {
    throw new Error("CurrentUserId or FollowingUserId is not provided ");
  }

  const alreadyExist = await Follower.exists({
    user: followingUserId,
    follower: currentUserId,
  });

  if (!alreadyExist) {
    throw new Error("Not Followed yet");
  }

  const newFollowing = await Follower.deleteMany({
    user: followingUserId,
    follower: currentUserId,
  });

  return newFollowing;
};

export default removeSingleFollowingDB;
