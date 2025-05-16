import createNewFollowingDB from "../../database/Follower/createNewFollowingDB.js";
import userFollowersCount from "../../database/Follower/userFollowersCount.js";
import userFollowingsCount from "../../database/Follower/userFollowingsCount.js";
import getUserById from "../../database/User/getUserById.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";

const createNewFollowing = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);
    const { io } = socketConnect();

    const { userId } = args;

    const result = await createNewFollowingDB(findUser._id, userId);

    const currentUserFollowingCount = await userFollowingsCount(findUser._id);
    const followingUserFollowerCount = await userFollowersCount(userId);

    const followingUser = await getUserById(userId);

    io.emit("add-following", {
      user: findUser,
      followingUser,
      followingCount: currentUserFollowingCount,
    });

    io.emit("add-follower", {
      user: followingUser,
      followerUser: findUser,
      followerCount: followingUserFollowerCount,
    });

    return "Followed Sucessfully";
  }
);

export default createNewFollowing;
