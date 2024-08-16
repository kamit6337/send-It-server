import Follower from "../../models/FollowerModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getUserFollowingCheck = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Id needs to be provided", 404));
  }

  const check = await Follower.exists({
    user: id,
    follower: userId,
  });

  res.json({
    message: "check id if followed by user or not",
    data: !!check,
  });
});

export default getUserFollowingCheck;
