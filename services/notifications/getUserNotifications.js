import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserNotifications = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);
  }
);

export default getUserNotifications;
