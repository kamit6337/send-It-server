import getUserFollowingsDB from "../../database/Follower/getuserFollowingsDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserFollowings = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const { userId, page } = args;

    const result = await getUserFollowingsDB(findUser._id, userId, page);

    return result;
  }
);

export default getUserFollowings;
