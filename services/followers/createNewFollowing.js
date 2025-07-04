import createNewFollowingDB from "../../database/Follower/createNewFollowingDB.js";
import userFollowersCount from "../../database/Follower/userFollowersCount.js";
import userFollowingsCount from "../../database/Follower/userFollowingsCount.js";
import getUserById from "../../database/User/getUserById.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
import { addNotificationJob } from "../../queues/notificationQueues/notificationQueue.js";

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

    // Add to follow notification queue

    await addNotificationJob(userId, "follower", {
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      photo: findUser.photo,
    });

    // await addFollowJob(userId, {
    //   _id: findUser._id,
    //   name: findUser.name,
    //   email: findUser.email,
    //   photo: findUser.photo,
    // });

    return "Followed Sucessfully";
  }
);

export default createNewFollowing;
