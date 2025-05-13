import getFollowingPostsByUserId from "../../database/Post/getFollowingPostsByUserId.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserFollowingPosts = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);

    const { page } = args;

    const results = await getFollowingPostsByUserId(findUser._id, page);

    return results;
  }
);

export default getUserFollowingPosts;
