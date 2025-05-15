import amIFollowThisUser from "../../database/Follower/amIFollowThisUser.js";
import userFollowersCount from "../../database/Follower/userFollowersCount.js";
import userFollowingsCount from "../../database/Follower/userFollowingsCount.js";
import userLikeCount from "../../database/Post_Details/userLikeCount.js";
import userMediaPostCount from "../../database/Post_Details/userMediaPostCount.js";
import userPostCount from "../../database/Post_Details/userPostCount.js";
import userReplyCount from "../../database/Post_Details/userReplyCount.js";
import userSavePostCount from "../../database/Post_Details/userSavePostCount.js";
import getUserByEmail from "../../database/User/getUserByEmail.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";

const getUserProfile = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);

  const { email } = args;

  const user = await getUserByEmail(email);

  const followerCount = userFollowersCount(user._id.toString());

  const followingCount = userFollowingsCount(user._id.toString());

  const findFollowing = amIFollowThisUser(
    user._id.toString(),
    findUser._id?.toString()
  );

  const postCount = userPostCount(user._id.toString());

  const likePostCount = userLikeCount(user._id.toString());

  const replyPostCount = userReplyCount(user._id.toString());

  const mediaPostCount = userMediaPostCount(user._id.toString());

  const savePostCount = userSavePostCount(user._id.toString());

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
    ...JSON.parse(JSON.stringify(user)),
    followersCount: followers,
    followingCount: following,
    isFollowed,
    userPosts,
    likePosts,
    replyPosts,
    mediaPosts,
    savePosts,
  };

  return obj;
});

export default getUserProfile;
