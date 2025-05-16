import getUserSavePostsDB from "../../database/Save/getUserSavePostsDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserSavePosts = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const { page } = args;

    const result = await getUserSavePostsDB(findUser._id, page);

    return result;
  }
);

export default getUserSavePosts;
