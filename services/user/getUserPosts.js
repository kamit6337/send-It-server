import getPostsByUserIdDB from "../../database/Post/getPostsByUserIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserPosts = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  const { userId, page } = args;

  const result = await getPostsByUserIdDB(userId, page);

  return result;
});

export default getUserPosts;
