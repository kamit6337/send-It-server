import getUserNotificationCount from "../../services/notifications/getUserNotificationCount.js";
import getUserNotifications from "../../services/notifications/getUserNotifications.js";
import updateNotificationList from "../../services/notifications/updateNotificationList.js";

const notificationResolvers = {
  Query: {
    getUserNotifications: getUserNotifications,
    getUserNotificationCount: getUserNotificationCount,
  },
  Mutation: {
    updateNotificationList: updateNotificationList,
  },
};

export default notificationResolvers;
