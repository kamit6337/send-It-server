import getFollowingPostsByUserId from "../../database/Post/getFollowingPostsByUserId.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserFollowingPosts = catchGraphQLError(
  async (parent, args, { req }) => {
    const user = await Req(req);

    const { page } = args;

    const results = await getFollowingPostsByUserId(user._id, page);

    return results;
  }
);

export default getUserFollowingPosts;
