import getRepliesByPostIdDB from "../../database/Reply/getRepliesByPostIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getPostReplies = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  const { postId, page } = args;

  const result = await getRepliesByPostIdDB(postId, page);

  return result;
});

export default getPostReplies;
