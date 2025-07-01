import Notification from "../../models/NotificationModel.js";

const checkAlreadyPostNotificationDB = async (userId, postId) => {
  if (!userId || !postId) throw new Error("UserId or PostId is not provided");

  const checkExists = await Notification.exists({
    post: postId,
    senderIds: { $in: [userId] },
  });

  return !!checkExists;
};

export default checkAlreadyPostNotificationDB;
