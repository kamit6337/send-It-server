import getRepliesByUserIdDB from "../../database/Reply/getRepliesByUserIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserReplyPosts = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const { userId, page } = args;

    const result = await getRepliesByUserIdDB(userId, page);

    return result;
  }
);

export default getUserReplyPosts;
