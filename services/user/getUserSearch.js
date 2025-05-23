import getUserBySearchDB from "../../database/User/getUserBySearchDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";

const getUserSearch = catchGraphQLError(async (parent, args, { user }) => {
  const { search } = args;

  const result = await getUserBySearchDB(user._id, search);

  return result;
});

export default getUserSearch;
