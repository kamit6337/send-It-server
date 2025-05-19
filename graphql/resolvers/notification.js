import getUserNotifications from "../../services/notifications/getUserNotifications.js";

const notificationResolvers = {
  Query: {
    getUserNotifications: getUserNotifications,
  },
};

export default notificationResolvers;
