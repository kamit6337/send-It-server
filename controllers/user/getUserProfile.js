import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import getUserByUsername from "../../database/User/getUserByUsername.js";
import userFollowersCount from "../../database/Follower/userFollowersCount.js";
import userFollowingsCount from "../../database/Follower/userFollowingsCount.js";
import amIFollowThisUser from "../../database/Follower/amIFollowThisUser.js";

const getUserProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { username } = req.query;

  if (!username) {
    return next(new HandleGlobalError("Username must be provided", 404));
  }

  const findUser = await getUserByUsername(username);

  if (!findUser) {
    res.json({
      message: "Wrong username",
      data: username,
    });
    return;
  }

  const followerCount = userFollowersCount(findUser._id.toString());

  const followingCount = userFollowingsCount(findUser._id.toString());

  const findFollowing = amIFollowThisUser(userId, findUser._id.toString());

  const [followers, following, isFollowed] = await Promise.all([
    followerCount,
    followingCount,
    findFollowing,
  ]);

  const obj = {
    ...findUser,
    followersCount: followers,
    followingCount: following,
    isFollowed: isFollowed,
  };

  res.json({
    message: "user profile",
    data: obj,
  });
});

export default getUserProfile;
