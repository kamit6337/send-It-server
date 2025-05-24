import getUserBySearchDB from "../../database/User/getUserBySearchDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserSearch = catchGraphQLError(async (parent, args, { req }) => {
  const user = await Req(req);

  const { search } = args;

  const result = await getUserBySearchDB(user._id, search);

  return result;
});

export default getUserSearch;
