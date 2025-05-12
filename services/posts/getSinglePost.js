import getSinglePostDB from "../../database/Post/getSinglePostDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getSinglePost = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  const { id } = args;

  const result = await getSinglePostDB(findUser._id, id);
  return result;
});

export default getSinglePost;
