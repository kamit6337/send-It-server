import Save from "../../models/SaveModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";
import ObjectID from "../../utils/ObjectID.js";

const userSavedPosts = catchAsyncDBError(async (userId, page) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  const posts = await Save.aggregate([
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

  return posts;
});

export default userSavedPosts;
