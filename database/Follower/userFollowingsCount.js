import Follower from "../../models/FollowerModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const userFollowingsCount = catchAsyncDBError(async (userId) => {
  const followingCount = await Follower.countDocuments({
    user: { $ne: userId },
    follower: userId,
  });

  return followingCount;
});

export default userFollowingsCount;
