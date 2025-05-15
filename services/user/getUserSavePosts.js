import getUserSavePostsDB from "../../database/Save/getUserSavePostsDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserSavePosts = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const { userId, page } = args;

    const result = await getUserSavePostsDB(userId, page);

    return result;
  }
);

export default getUserSavePosts;
