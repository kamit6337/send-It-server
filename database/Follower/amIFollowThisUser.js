import Follower from "../../models/FollowerModel.js";

const amIFollowThisUser = async (followingId, followerId) => {
  if (!followingId || !followerId) {
    throw new Error("FollowingId or FollowerId is not provided");
  }

  const findFollowing = await Follower.exists({
    user: followingId,
    follower: followerId,
  });

  return !!findFollowing;
};

export default amIFollowThisUser;
