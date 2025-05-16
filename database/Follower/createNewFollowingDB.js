import Follower from "../../models/FollowerModel.js";

const createNewFollowingDB = async (currentUserId, followingUserId) => {
  if (!currentUserId || !followingUserId) {
    throw new Error("CurrentUserId or FollowingUserId is not provided ");
  }

  const alreadyExist = await Follower.exists({
    user: followingUserId,
    follower: currentUserId,
  });

  if (!!alreadyExist) {
    throw new Error("Already followed");
  }

  const newFollowing = await Follower.create({
    user: followingUserId,
    follower: currentUserId,
  });

  return newFollowing;
};
export default createNewFollowingDB;
