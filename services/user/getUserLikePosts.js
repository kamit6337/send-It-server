import getUserLikePostsDB from "../../database/Like/getUserLikePostsDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserLikePosts = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const { userId, page } = args;

    const result = await getUserLikePostsDB(userId, page);

    return result;
  }
);

export default getUserLikePosts;
