import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const newFollowing = catchAsyncDBError(async (followingId, userId) => {
  const following = await Follower.create({
    user: followingId,
    follower: userId,
  });

  return following;
});

export default newFollowing;
