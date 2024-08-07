import Follower from "../../../models/FollowerModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";

const getUserFollowing = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const following = await Follower.find({
    user: { $ne: userId },
    follower: userId,
  })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "user",
      select: "username name photo",
    });

  res.json({
    message: "user following",
    page: page,
    data: following,
  });
});

export default getUserFollowing;
