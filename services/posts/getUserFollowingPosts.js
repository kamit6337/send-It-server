import getFollowingPostsByUserId from "../../database/Post/getFollowingPostsByUserId.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";

const getUserFollowingPosts = catchGraphQLError(
  async (parent, args, { user }) => {
    const { page } = args;

    const results = await getFollowingPostsByUserId(user._id, page);

    return results;
  }
);

export default getUserFollowingPosts;
