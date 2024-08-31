import Like from "../../models/LikeModel.js";
// import {
//   getCachedUserLikedPosts,
//   setUserLikedPosts,
// } from "../../redis/Post/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";
import ObjectID from "../../utils/ObjectID.js";

const userLikedPosts = catchAsyncDBError(async (userId, { limit, skip }) => {
  // const cachedPosts = await getCachedUserLikedPosts(userId, { limit, skip });
  // if (cachedPosts) return cachedPosts;

  const posts = await Like.aggregate([
    {
      $match: {
        user: ObjectID(userId),
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
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
        "post.createdAt": 1,
        "post.updatedAt": 1,
        "post.user._id": 1,
        "post.user.name": 1,
        "post.user.username": 1,
        "post.user.photo": 1,
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
        "post.isFollow": {
          $cond: {
            if: { $eq: [{ $size: "$post.isFollow" }, 1] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $replaceRoot: { newRoot: "$post" }, // Replace root to make "post" the root object
    },
  ]);

  // await setUserLikedPosts(userId, posts);

  return posts;
});

export default userLikedPosts;
