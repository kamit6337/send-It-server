import getNotificationByIdDB from "../../database/Notification/getNotificationByIdDB.js";
import getNotificationCountByUserIdDB from "../../database/Notification/getNotificationCountByUserIdDB.js";
import socketConnect from "../../lib/socketConnect.js";
import notificationMsg from "../../utils/javaScript/notificationMsg.js";
import { redisSub } from "../redisClient.js";

// 1. Subscribe to the channel
await redisSub.subscribe("notification");

console.log("Redis Pub-Sub listening for Notification channel");

// 2. Listen for messages
redisSub.on("message", async (channel, message) => {
  if (channel !== "notification") return;

  const { io } = socketConnect();

  const notificationIds = JSON.parse(message);

  console.log("notificationIds", notificationIds);

  if (!notificationIds || notificationIds.length === 0) {
    console.log("Notifications Ids not provided");
    return;
  }

  const notifications = await getNotificationByIdDB(notificationIds);

  notifications.forEach((notification) => {
    io.to(notification.user.toString()).emit("notification", {
      ...notification,
      message: notificationMsg(notification),
    });
  });

  const userId = notifications[0].user.toString();

  // const notificationCount = await getNotificationCountByUserIdDB(userId);

  io.to(userId).emit("notification-count", notifications.length);
});
