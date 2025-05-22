import DataLoader from "dataloader";
import Follower from "../../models/FollowerModel.js";

const createUserFollowingLoader = () =>
  new DataLoader(async (ids) => {
    // ids = [{user, follower}, {user, follower}]

    const followingIds = [...ids];

    const followings = await Follower.find({
      $or: followingIds,
    }).lean();

    const followingSet = new Set(
      followings.map(
        (following) =>
          `${following.user.toString()}_${following.follower.toString()}`
      )
    );

    return followingIds.map(({ user, follower }) =>
      followingSet.has(`${user.toString()}_${follower.toString()}`)
    );
  });

export default createUserFollowingLoader;
