import Follower from "../../models/FollowerModel.js";

const amIFollowThisUser = async (followingId, followerId) => {
  const findFollowing = await Follower.exists({
    user: followingId,
    follower: followerId,
  });

  return !!findFollowing;
};

export default amIFollowThisUser;
