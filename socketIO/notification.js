import { io } from "../lib/socketConnect.js";

export const sendNewNotificationIO = (userId, obj) => {
  io.to(userId).emit("newNotification", obj);
};
