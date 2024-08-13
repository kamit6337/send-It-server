import Follower from "../../../models/FollowerModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";

const removeFollowing = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: followingId } = req.query;

  if (!followingId) {
    return next(new HandleGlobalError("Follwing ID must be provided", 404));
  }

  const following = await Follower.deleteOne({
    user: followingId,
    follower: userId,
  });

  res.json({
    message: "New Following",
    data: following,
  });
});

export default removeFollowing;
