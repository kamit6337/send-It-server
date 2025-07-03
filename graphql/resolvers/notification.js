import getNotificationCountByUserIdDB from "../../database/Notification/getNotificationCountByUserIdDB.js";
import getNotificationsByUserIdDB from "../../database/Notification/getNotificationsByUserIdDB.js";
import Req from "../../lib/Req.js";
import updateNotificationList from "../../services/notifications/updateNotificationList.js";
import notificationMsg from "../../utils/javaScript/notificationMsg.js";

const notificationResolvers = {
  Query: {
    getUserNotifications: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      const { page } = args;

      const notifications = await getNotificationsByUserIdDB(user._id, page);
      return notifications;
    },
    getUserNotificationCount: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      const result = await getNotificationCountByUserIdDB(user._id);
      return result;
    },
  },
  Notification: {
    message: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      return notificationMsg(parent);
    },
    sender: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      return await loaders.userLoader.loadMany(parent.sender);
    },
    post: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      if (!parent.post) return null;

      return loaders.postLoader.load(parent.post);
    },
    room: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      if (!parent.room) return null;

      return await loaders.roomLoader.load(parent.room);
    },
  },
  Mutation: {
    updateNotificationList: updateNotificationList,
  },
};

export default notificationResolvers;
