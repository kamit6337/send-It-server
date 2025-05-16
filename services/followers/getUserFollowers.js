import getUserFollowersDB from "../../database/Follower/getUserFollowersDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserFollowers = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const { userId, page } = args;

    const result = await getUserFollowersDB(findUser._id, userId, page);

    return result;
  }
);

export default getUserFollowers;
