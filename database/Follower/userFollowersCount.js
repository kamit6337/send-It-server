import Follower from "../../models/FollowerModel.js";
// import {
//   getUserFollowersCount,
//   setUserFollowersCount,
// } from "../../redis/Follower/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const userFollowersCount = catchAsyncDBError(async (userId) => {
  // const getCount = await getUserFollowersCount(userId);
  // if (getCount === 0 || getCount) return getCount;

  const followerCount = await Follower.countDocuments({
    user: userId,
    follower: { $ne: userId },
  });

  // await setUserFollowersCount(userId, followerCount);

  return followerCount;
});

export default userFollowersCount;
