import getUserLikePostsDB from "../../database/Like/getUserLikePostsDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserLikePosts = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const { page } = args;

    const result = await getUserLikePostsDB(findUser._id, page);

    return result;
  }
);

export default getUserLikePosts;
