import Post from "../../models/PostModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import ObjectID from "../../utils/ObjectID.js";

const getSinglePost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  const post = await Post.aggregate([
    {
      $match: {
        _id: ObjectID(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        "user._id": 1,
        "user.username": 1,
        "user.name": 1,
        "user.photo": 1,
        _id: 1,
        message: 1, // Include the post's message
        media: 1, // Include the post's media URL
        replyCount: 1, // Include the post's reply count
        likeCount: 1, // Include the post's like count
        viewCount: 1, // Include the post's view count
        createdAt: 1, // Include the post's creation date
        updatedAt: 1, // Include the post's update date
      },
    },

    {
      $lookup: {
        from: "likes",
        let: { postId: ObjectID(id), userId: ObjectID(userId) },
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
        as: "isLiked",
      },
    },
    {
      $lookup: {
        from: "followers",
        let: { me: ObjectID(userId), followingId: "$user._id" },
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
        as: "isFollow",
      },
    },
    {
      $addFields: {
        isLiked: {
          $cond: {
            if: { $eq: [{ $size: "$isLiked" }, 1] },
            then: true,
            else: false,
          },
        },
        isFollow: {
          $cond: {
            if: { $eq: [{ $size: "$isFollow" }, 1] },
            then: true,
            else: false,
          },
        },
      },
    },
  ]);

  res.json({ message: "Single post", data: post[0] });
});

export default getSinglePost;
