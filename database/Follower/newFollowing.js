import { setSingleUserFollowing } from "../../redis/Follower/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const newFollowing = catchAsyncDBError(async (followingId, userId) => {
  const following = await Follower.create(
    [
      {
        user: followingId,
        follower: userId,
      },
    ],
    { new: true }
  ).then((doc) =>
    Follower.populate(doc, {
      path: "user",
      select: "_id name username photo", // Specify fields to select if needed
    })
  );

  const obj = {
    ...JSON.parse(JSON.stringify(following)),
    isActualUserFollow: true,
  };

  await setSingleUserFollowing(userId, obj);

  return following;
});

export default newFollowing;
