import Notification from "../../models/NotificationModel.js";

const getNotificationByIdDB = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Ids is not provided");
  }

  const notifications = await Notification.find({
    _id: { $in: ids },
  })
    .populate([
      {
        path: "sender",
        select: "_id name email photo",
      },
      {
        path: "post",
      },
    ])
    .sort({ createdAt: -1 })
    .lean();

  return notifications;
};

export default getNotificationByIdDB;
