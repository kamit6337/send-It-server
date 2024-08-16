import Reply from "../../models/ReplyModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import ObjectID from "../../utils/ObjectID.js";

const getUserReplies = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1, id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("User ID in not provided", 404));
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const replies = await Reply.aggregate([
    {
      $match: {
        user: ObjectID(id),
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "posts",
        localField: "post",
        foreignField: "_id",
        as: "post",
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "replyPost",
        foreignField: "_id",
        as: "replyPost",
      },
    },

    {
      $unwind: "$post",
    },
    {
      $unwind: "$replyPost",
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
      $lookup: {
        from: "users",
        localField: "replyPost.user",
        foreignField: "_id",
        as: "replyPost.user",
      },
    },
    {
      $unwind: "$post.user",
    },
    {
      $unwind: "$replyPost.user",
    },
    {
      $project: {
        _id: 1,
        createdAt: 1,
        updatedAt: 1,

        "post.user._id": 1,
        "post.user.username": 1,
        "post.user.name": 1,
        "post.user.photo": 1,
        "post._id": 1,
        "post.message": 1, // Include the post's message
        "post.media": 1, // Include the post's media URL
        "post.replyCount": 1, // Include the post's reply count
        "post.likeCount": 1, // Include the post's like count
        "post.viewCount": 1, // Include the post's view count
        "post.saveCount": 1, // Include the post's view count
        "post.retweetCount": 1, // Include the post's view count
        "post.createdAt": 1, // Include the post's creation date
        "post.updatedAt": 1, // Include the post's update date

        "replyPost.user._id": 1,
        "replyPost.user.username": 1,
        "replyPost.user.name": 1,
        "replyPost.user.photo": 1,
        "replyPost._id": 1,
        "replyPost.message": 1, // Include the replyPost's message
        "replyPost.media": 1, // Include the replyPost's media URL
        "replyPost.replyCount": 1, // Include the replyPost's reply count
        "replyPost.likeCount": 1, // Include the replyPost's like count
        "replyPost.viewCount": 1, // Include the replyPost's view count
        "replyPost.saveCount": 1, // Include the replyPost's view count
        "replyPost.retweetCount": 1, // Include the replyPost's view count
        "replyPost.createdAt": 1, // Include the replyPost's creation date
        "replyPost.updatedAt": 1, // Include the post's update date
      },
    },
    {
      $lookup: {
        from: "followers",
        let: { userId: "$post.user._id", me: ObjectID(userId) },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$userId"] },
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
      $lookup: {
        from: "likes",
        let: { postId: "$post._id", me: ObjectID(userId) },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$post", "$$postId"] },
                  { $eq: ["$user", "$$me"] },
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
        from: "saves",
        let: { postId: "$post._id", me: ObjectID(userId) },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$post", "$$postId"] },
                  { $eq: ["$user", "$$me"] },
                ],
              },
            },
          },
        ],
        as: "post.isSaved",
      },
    },
    {
      $lookup: {
        from: "followers",
        let: { userId: "$replyPost.user._id", me: ObjectID(userId) },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$userId"] },
                  { $eq: ["$follower", "$$me"] },
                ],
              },
            },
          },
        ],
        as: "replyPost.isFollow",
      },
    },
    {
      $lookup: {
        from: "likes",
        let: { postId: "$replyPost._id", me: ObjectID(userId) },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$post", "$$postId"] },
                  { $eq: ["$user", "$$me"] },
                ],
              },
            },
          },
        ],
        as: "replyPost.isLiked",
      },
    },
    {
      $lookup: {
        from: "saves",
        let: { postId: "$replyPost._id", me: ObjectID(userId) },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$post", "$$postId"] },
                  { $eq: ["$user", "$$me"] },
                ],
              },
            },
          },
        ],
        as: "replyPost.isSaved",
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
        "post.isSaved": {
          $cond: {
            if: { $eq: [{ $size: "$post.isSaved" }, 1] },
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
        "replyPost.isLiked": {
          $cond: {
            if: { $eq: [{ $size: "$replyPost.isLiked" }, 1] },
            then: true,
            else: false,
          },
        },
        "replyPost.isSaved": {
          $cond: {
            if: { $eq: [{ $size: "$replyPost.isSaved" }, 1] },
            then: true,
            else: false,
          },
        },
        "replyPost.isFollow": {
          $cond: {
            if: { $eq: [{ $size: "$replyPost.isFollow" }, 1] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  res.json({
    message: "User replies",
    page,
    data: replies,
  });
});

export default getUserReplies;
