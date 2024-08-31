import deleteFollowing from "../../database/Follower/deleteFollowing.js";
import { deleteFollowingIO } from "../../socketIO/following.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const removeFollowing = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: followingId, username } = req.query;

  if (!followingId || !username) {
    return next(new HandleGlobalError("Follwing ID must be provided", 404));
  }

  await deleteFollowing(userId, followingId);

  const obj = {
    user: {
      _id: followingId,
      username,
    },
    follower: {
      _id: userId,
    },
  };

  deleteFollowingIO(obj);

  res.json({
    message: "New Following",
  });
});

export default removeFollowing;
