import getNotificationsByUserIdDB from "../../database/Notification/getNotificationsByUserIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import notificationMsg from "../../utils/javaScript/notificationMsg.js";

const getUserNotifications = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const { page } = args;

    const notifications = await getNotificationsByUserIdDB(findUser._id, page);

    const addMessageToNotifications = notifications.map((notification) => {
      return {
        ...notification,
        message: notificationMsg(notification),
      };
    });

    console.log("addMessageToNotifications", addMessageToNotifications);

    return addMessageToNotifications;
  }
);

export default getUserNotifications;
