import userFollowings from "../../database/Follower/userFollowings.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getUserFollowing = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1, id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Pleae provide user id", 404));
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const followingAggregate = await userFollowings(id, userId, { skip, limit });

  res.json({
    message: "user following",
    page: page,
    data: followingAggregate,
  });
});

export default getUserFollowing;
