import Follower from "../../../models/FollowerModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";

const getUserFollower = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const followers = await Follower.find({
    user: userId,
    follower: { $ne: userId },
  })
    .skip(skip)
    .limit(limit)
    .populate({
      path: "follower",
      select: "username name photo",
    });

  res.json({
    message: "user following",
    page: page,
    data: followers,
  });
});

export default getUserFollower;
