import Like from "../../models/LikeModel.js";
// import { updatePostLike } from "../../redis/Like/checkExistsAndUpdate.js";
// import { setSingleUserLikedPost } from "../../redis/Like/likedPosts.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const createLike = catchAsyncDBError(async (userId, postId) => {
  await Like.create({ user: userId, post: postId });

  // const post = await Like.aggregate([
  //   {
  //     $match: {
  //       user: ObjectID(userId),
  //       post: ObjectID(postId),
  //     },
  //   },
  //   {
  //     $skip: skip,
  //   },
  //   {
  //     $limit: limit,
  //   },
  //   {
  //     $sort: { createdAt: -1 },
  //   },
  //   {
  //     $lookup: {
  //       from: "posts",
  //       localField: "post",
  //       foreignField: "_id",
  //       as: "post",
  //     },
  //   },
  //   {
  //     $unwind: "$post",
  //   },
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "post.user",
  //       foreignField: "_id",
  //       as: "post.user",
  //     },
  //   },
  //   {
  //     $unwind: "$post.user",
  //   },
  //   {
  //     $project: {
  //       "post._id": 1,
  //       "post.message": 1,
  //       "post.media": 1,
  //       "post.user._id": 1,
  //       "post.user.name": 1,
  //       "post.user.username": 1,
  //       "post.user.photo": 1,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "followers",
  //       let: { me: ObjectID(userId), followingId: "$post.user._id" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: {
  //               $and: [
  //                 { $eq: ["$user", "$$followingId"] },
  //                 { $eq: ["$follower", "$$me"] },
  //               ],
  //             },
  //           },
  //         },
  //       ],
  //       as: "post.isFollow",
  //     },
  //   },
  //   {
  //     $addFields: {
  //       "post.isFollow": {
  //         $cond: {
  //           if: { $eq: [{ $size: "$post.isFollow" }, 1] },
  //           then: true,
  //           else: false,
  //         },
  //       },
  //     },
  //   },
  //   {
  //     $replaceRoot: { newRoot: "$post" }, // Replace root to make "post" the root object
  //   },
  // ]);

  // await setSingleUserLikedPost(userId, post[0]);

  // await updatePostLike(userId, postId, true);
});

export default createLike;
