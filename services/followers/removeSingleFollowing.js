import removeSingleFollowingDB from "../../database/Follower/removeSingleFollowingDB.js";
import userFollowersCount from "../../database/Follower/userFollowersCount.js";
import userFollowingsCount from "../../database/Follower/userFollowingsCount.js";
import getUserById from "../../database/User/getUserById.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";

const removeSingleFollowing = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);
    const { io } = socketConnect();

    const { userId } = args;

    await removeSingleFollowingDB(findUser._id, userId);

    const currentUserFollowingCount = await userFollowingsCount(findUser._id);
    const followingUserFollowerCount = await userFollowersCount(userId);

    const followingUser = await getUserById(userId);

    io.emit("remove-following", {
      user: findUser,
      followingUser,
      followingCount: currentUserFollowingCount,
    });

    io.emit("remove-follower", {
      user: followingUser,
      followerUser: findUser,
      followerCount: followingUserFollowerCount,
    });

    return "Following Removed Successfully";
  }
);

export default removeSingleFollowing;
