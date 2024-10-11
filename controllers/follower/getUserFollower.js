import getFollowersByUserId from "../../database/Follower/getFollowersByUserId.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getUserFollower = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1, id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Pleae provide user id", 404));
  }

  const followersAggregate = await getFollowersByUserId(userId, id, page);

  res.json(followersAggregate);
});

export default getUserFollower;
