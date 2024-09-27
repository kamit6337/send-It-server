import { sendNotificationAsync } from "../../BullMQ/notification/notificationQueue.js";
import amIFollowThisUser from "../../database/Follower/amIFollowThisUser.js";
import newFollowing from "../../database/Follower/newFollowing.js";
import { sendNewFollowingIO } from "../../socketIO/following.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { v4 as uuid } from "uuid";

const createFollowing = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const userId = req.userId;

  const { id: followingId, username } = req.body;

  if (!followingId || !username) {
    return next(new HandleGlobalError("Following ID must be provided", 404));
  }

  const isAlreadyFollow = await amIFollowThisUser(followingId, userId);

  if (!!isAlreadyFollow) {
    return next(new HandleGlobalError("You already follow this user", 404));
  }

  const promises = [
    amIFollowThisUser(userId, followingId),
    newFollowing(followingId, userId),
    sendNotificationAsync("follow", followingId, userId),
  ];

  const [checkFollow] = await Promise.all(promises);

  const obj = {
    _id: checkFollow?._id || uuid(),
    user: {
      _id: followingId,
      username,
    },
    follower: { ...user },
    isActualUserFollow: !!checkFollow,
  };

  sendNewFollowingIO(obj);

  res.json({
    message: "New Following",
  });
});

export default createFollowing;
