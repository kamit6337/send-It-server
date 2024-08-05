import Follower from "../../../models/FollowerModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";

const getUserFollowingPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const following = await Follower.aggregate([
    { $match: { follower: userId } },
    {
      $lookup: {
        from: "posts",
        localField: "user",
        foreignField: "user",
        as: "posts",
      },
    },
    { $unwind: "$posts" },
    { $sort: { "posts.updatedAt": -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "posts.user",
        foreignField: "_id",
        as: "posts.user",
      },
    },
    { $unwind: "$posts.user" },
    {
      $project: {
        "posts.user.username": 1,
        "posts.user.name": 1,
        "posts.user.photo": 1,
        "posts._id": 1,
        "posts.message": 1,
        "posts.media": 1,
        "posts.replyCount": 1,
        "posts.likeCount": 1,
        "posts.viewCount": 1,
        "posts.createdAt": 1,
        "posts.updatedAt": 1,
      },
    },
  ]);

  console.log("following", following);

  res.json({
    message: "user following posts",
    page,
    data: following.map(({ posts }) => posts),
  });
});

export default getUserFollowingPost;
