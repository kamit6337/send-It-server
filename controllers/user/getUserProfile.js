import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import getUserByUsername from "../../database/User/getUserByUsername.js";
import userFollowersCount from "../../database/Follower/userFollowersCount.js";
import userFollowingsCount from "../../database/Follower/userFollowingsCount.js";
import amIFollowThisUser from "../../database/Follower/amIFollowThisUser.js";
import userPostCount from "../../database/Post/userPostCount.js";
import userLikeCount from "../../database/Like/userLikeCount.js";
import userReplyCount from "../../database/Reply/userReplyCount.js";
import userMediaPostCount from "../../database/Post/userMediaPostCount.js";
import userSavePostCount from "../../database/Save/userSavePostCount.js";

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

  const findFollowing = amIFollowThisUser(findUser._id.toString(), userId);

  const postCount = userPostCount(userId);

  const likePostCount = userLikeCount(userId);

  const replyPostCount = userReplyCount(userId);

  const mediaPostCount = userMediaPostCount(userId);

  const savePostCount = userSavePostCount(userId);

  const [
    followers,
    following,
    isFollowed,
    userPosts,
    likePosts,
    replyPosts,
    mediaPosts,
    savePosts,
  ] = await Promise.all([
    followerCount,
    followingCount,
    findFollowing,
    postCount,
    likePostCount,
    replyPostCount,
    mediaPostCount,
    savePostCount,
  ]);

  const obj = {
    ...findUser,
    followersCount: followers,
    followingCount: following,
    isFollowed: !!isFollowed,
    userPosts,
    likePosts,
    replyPosts,
    mediaPosts,
    savePosts,
  };

  res.json(obj);
});

export default getUserProfile;
