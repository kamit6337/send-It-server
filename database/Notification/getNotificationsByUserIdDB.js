import Notification from "../../models/NotificationModel";

const getNotificationsByUserIdDB = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserId or Page is not provided");
  }

  const notifications = await Notification.find({
    user: userId,
    isRead: false,
  }).populate([
    {
      path: "sender",
      select: "_id name email photo",
    },
  ]);
};

export default getNotificationsByUserIdDB;
