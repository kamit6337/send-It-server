import newFollowing from "../../database/Follower/newFollowing.js";
import Follower from "../../models/FollowerModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const createFollowing = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const { id: followingId } = req.body;

  if (!followingId) {
    return next(new HandleGlobalError("Follwing ID must be provided", 404));
  }

  const following = await newFollowing(followingId, userId);

  res.json({
    message: "New Following",
    data: following,
  });
});

export default createFollowing;
