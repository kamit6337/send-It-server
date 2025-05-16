import getSingleReplyDB from "../../database/Reply/getSingleReplyDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getSingleReply = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  const { postId } = args;

  const result = await getSingleReplyDB(postId);

  return result;
});
export default getSingleReply;
