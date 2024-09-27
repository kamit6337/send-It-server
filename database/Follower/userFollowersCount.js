import Follower from "../../models/FollowerModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const userFollowersCount = catchAsyncDBError(async (userId) => {
  const followerCount = await Follower.countDocuments({
    user: userId,
    follower: { $ne: userId },
  });

  return followerCount;
});

export default userFollowersCount;
