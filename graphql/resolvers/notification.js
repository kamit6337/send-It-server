import getUserNotificationCount from "../../services/notifications/getUserNotificationCount.js";
import getUserNotifications from "../../services/notifications/getUserNotifications.js";

const notificationResolvers = {
  Query: {
    getUserNotifications: getUserNotifications,
    getUserNotificationCount: getUserNotificationCount,
  },
};

export default notificationResolvers;
