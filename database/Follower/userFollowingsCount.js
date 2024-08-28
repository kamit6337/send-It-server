import Follower from "../../models/FollowerModel.js";
import {
  getUserFollowingsCount,
  setUserFollowingsCount,
} from "../../redis/Follower/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const userFollowingsCount = catchAsyncDBError(async (userId) => {
  const getCount = await getUserFollowingsCount(userId);
  if (getCount === 0 || getCount) return getCount;

  const followingCount = await Follower.countDocuments({
    user: { $ne: userId },
    follower: userId,
  });

  await setUserFollowingsCount(userId, followingCount);

  return followingCount;
});

export default userFollowingsCount;
