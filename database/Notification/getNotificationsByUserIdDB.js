import Notification from "../../models/NotificationModel.js";

const getNotificationsByUserIdDB = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserId or Page is not provided");
  }

  const limit = 10;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return notifications;
};

export default getNotificationsByUserIdDB;
