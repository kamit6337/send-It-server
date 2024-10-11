import getFollowingsByUserId from "../../database/Follower/getFollowingsByUserId.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getUserFollowing = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1, id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Pleae provide user id", 404));
  }

  const followingAggregate = await getFollowingsByUserId(id, userId, page);

  res.json(followingAggregate);
});

export default getUserFollowing;
