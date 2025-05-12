import getSinglePostDetailsDB from "../../database/Post/getSinglePostDetailsDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getPostDetails = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  const { id } = args;

  const response = await getSinglePostDetailsDB(findUser._id, id);

  return response;
});

export default getPostDetails;
