import Notification from "../../models/NotificationModel.js";

const createNewNotificationDB = async (obj) => {
  if (!obj) throw new Error("Obj is not provided");

  const newNotification = await Notification.create({
    ...obj,
  });

  return JSON.parse(JSON.stringify(newNotification));
};

export default createNewNotificationDB;
