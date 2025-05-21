import Notification from "../../models/NotificationModel.js";

const getNotificationsByUserIdDB = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserId or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({
    user: userId,
    isRead: false,
  })
    .sort("-updatedAt")
    .skip(skip)
    .limit(limit)
    .populate([
      {
        path: "sender",
        select: "_id name email photo",
      },
      {
        path: "post",
      },
    ])
    .lean();

  return notifications;
};

export default getNotificationsByUserIdDB;
