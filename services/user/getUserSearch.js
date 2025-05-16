import getUserBySearchDB from "../../database/User/getUserBySearchDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserSearch = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  const { search } = args;

  const result = await getUserBySearchDB(findUser._id, search);

  return result;
});

export default getUserSearch;
