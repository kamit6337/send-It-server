import getNotificationCountByUserIdDB from "../../database/Notification/getNotificationCountByUserIdDB.js";
import updateNotificationDB from "../../database/Notification/updateNotificationDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const updateNotificationList = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const { ids } = args;

    const update = await updateNotificationDB(ids);

    console.log("update notification", update);

    const notificationCount = await getNotificationCountByUserIdDB(
      findUser._id
    );

    return notificationCount;
  }
);

export default updateNotificationList;
