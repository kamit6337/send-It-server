import getNotificationCountByUserIdDB from "../../database/Notification/getNotificationCountByUserIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserNotificationCount = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const result = await getNotificationCountByUserIdDB(findUser._id);

    return result;
  }
);

export default getUserNotificationCount;
