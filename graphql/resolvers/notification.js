import getNotificationsByUserIdDB from "../../database/Notification/getNotificationsByUserIdDB.js";
import updateNotificationList from "../../services/notifications/updateNotificationList.js";
import notificationMsg from "../../utils/javaScript/notificationMsg.js";

const notificationResolvers = {
  Query: {
    getUserNotifications: async (parent, args, { user, loaders }) => {
      const { page } = args;

      const notifications = await getNotificationsByUserIdDB(user._id, page);
      return notifications;
    },
    getUserNotificationCount: async (parent, args, { user, loaders }) => {
      const result = await getNotificationCountByUserIdDB(user._id);
      return result;
    },
  },
  Notification: {
    message: async (parent, args, { user, loaders }) => {
      return notificationMsg(parent);
    },
    sender: async (parent, args, { user, loaders }) => {
      return await loaders.userLoader.load(parent.sender);
    },
  },
  Mutation: {
    updateNotificationList: updateNotificationList,
  },
};

export default notificationResolvers;
