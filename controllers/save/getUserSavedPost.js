import Save from "../../models/SaveModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import ObjectID from "../../utils/ObjectID.js";

const getUserSavedPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const saves = await Save.aggregate([
    {
      $match: {
        user: ObjectID(userId),
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $lookup: {
        from: "posts",
        localField: "post",
        foreignField: "_id",
        as: "post",
      },
    },
    {
      $unwind: "$post",
    },
    {
      $lookup: {
        from: "users",
        localField: "post.user",
        foreignField: "_id",
        as: "post.user",
      },
    },
    {
      $unwind: "$post.user",
    },
    {
      $project: {
        "post._id": 1,
        "post.message": 1,
        "post.media": 1,
        "post.replyCount": 1,
        "post.likeCount": 1,
        "post.viewCount": 1,
        "post.saveCount": 1,
        "post.createdAt": 1,
        "post.updatedAt": 1,

        "post.user._id": 1,
        "post.user.username": 1,
        "post.user.name": 1,
        "post.user.photo": 1,
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { postId: "$post._id", userId: ObjectID(userId) },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$userId"] },
                  { $eq: ["$post", "$$postId"] },
                ],
              },
            },
          },
        ],
        as: "post.isLiked",
      },
    },
    {
      $lookup: {
        from: "followers",
        let: { me: ObjectID(userId), followingId: "$post.user._id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$followingId"] },
                  { $eq: ["$follower", "$$me"] },
                ],
              },
            },
          },
        ],
        as: "post.isFollow",
      },
    },
    {
      $addFields: {
        "post.isLiked": {
          $cond: {
            if: { $eq: [{ $size: "$post.isLiked" }, 1] },
            then: true,
            else: false,
          },
        },
        "post.isFollow": {
          $cond: {
            if: { $eq: [{ $size: "$post.isFollow" }, 1] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  res.json({
    message: "user saved post",
    page,
    data: saves.map((obj) => obj.post),
  });
});
export default getUserSavedPost;
