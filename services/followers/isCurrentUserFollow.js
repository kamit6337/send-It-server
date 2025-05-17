import amIFollowThisUser from "../../database/Follower/amIFollowThisUser.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const isCurrentUserFollow = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const { userId } = args;

    const result = await amIFollowThisUser(userId, findUser._id);

    return result;
  }
);

export default isCurrentUserFollow;
