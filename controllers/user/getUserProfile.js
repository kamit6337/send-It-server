import Post from "../../models/PostModel.js";
import Like from "../../models/LikeModel.js";
import Reply from "../../models/ReplyModel.js";
import Follower from "../../models/FollowerModel.js";
import User from "../../models/UserModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getUserProfile = catchAsyncError(async (req, res, next) => {
  const { username } = req.query;

  if (!username) {
    return next(new HandleGlobalError("Username must be provided", 404));
  }

  const findUser = await User.findOne({ username }).lean();

  const postCount = Post.countDocuments({ user: findUser._id.toString() });
  const likeCount = Like.countDocuments({ user: findUser._id.toString() });
  const replyCount = Reply.countDocuments({ user: findUser._id.toString() });
  const followerCount = Follower.countDocuments({
    user: findUser._id.toString(),
    follower: { $ne: findUser._id.toString() },
  });
  const followingCount = Follower.countDocuments({
    user: { $ne: findUser._id.toString() },
    follower: findUser._id.toString(),
  });

  const [post, like, reply, followers, following] = await Promise.all([
    postCount,
    likeCount,
    replyCount,
    followerCount,
    followingCount,
  ]);

  const obj = {
    ...findUser,
    postCount: post,
    likeCount: like,
    replyCount: reply,
    followersCount: followers,
    followingCount: following,
  };

  res.json({
    message: "user profile",
    data: obj,
  });
});

export default getUserProfile;
