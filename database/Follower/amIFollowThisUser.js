import Follower from "../../models/FollowerModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const amIFollowThisUser = catchAsyncDBError(async (followingId, followerId) => {
  const findFollowing = await Follower.findOne({
    user: followingId,
    follower: followerId,
  });

  return findFollowing;
});

export default amIFollowThisUser;
