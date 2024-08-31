import Follower from "../../models/FollowerModel.js";
// import {
//   checkMineFollowing,
//   createMineFollowing,
// } from "../../redis/Follower/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const amIFollowThisUser = catchAsyncDBError(async (followingId, followerId) => {
  // const check = await checkMineFollowing(userId, followingId);
  // if (check) return check.isExists;

  const findFollowing = await Follower.findOne({
    user: followingId,
    follower: followerId,
  });

  // await createMineFollowing(userId, followingId, !!findFollowing);

  return findFollowing;
});

export default amIFollowThisUser;
