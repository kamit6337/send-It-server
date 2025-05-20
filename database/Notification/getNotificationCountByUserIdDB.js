import Notification from "../../models/NotificationModel.js";

const getNotificationCountByUserIdDB = async (userId) => {
  if (!userId) {
    throw new Error("UserId is not provided");
  }

  const notificationCount = await Notification.countDocuments({
    user: userId,
    isRead: false,
  });

  return notificationCount;
};

export default getNotificationCountByUserIdDB;
