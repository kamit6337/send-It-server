import Follower from "../../models/FollowerModel.js";
import {
  checkMineFollowing,
  createMineFollowing,
} from "../../redis/Follower/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const amIFollowThisUser = catchAsyncDBError(async (userId, followingId) => {
  const check = await checkMineFollowing(userId, followingId);
  if (check) return check.isExists;

  const findFollowing = await Follower.exists({
    user: followingId,
    follower: userId,
  });

  await createMineFollowing(userId, followingId, !!findFollowing);

  return !!findFollowing;
});

export default amIFollowThisUser;
