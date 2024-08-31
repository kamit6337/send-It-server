import Follower from "../../models/FollowerModel.js";

const deleteFollowing = async (userId, followingId) => {
  await Follower.deleteOne({
    user: followingId,
    follower: userId,
  });
};

export default deleteFollowing;
