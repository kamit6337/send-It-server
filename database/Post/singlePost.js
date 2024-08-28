import Post from "../../models/PostModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";
import ObjectID from "../../utils/ObjectID.js";

const singlePost = catchAsyncDBError(async (userId, postId) => {
  const post = await Post.aggregate([
    {
      $match: {
        _id: ObjectID(postId),
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
        createdAt: 1, // Include the post's creation date
        updatedAt: 1, // Include the post's update date
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
    // {
    //   $lookup: {
    //     from: "likes",
    //     let: { postId: ObjectID(id), userId: ObjectID(userId) },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [
    //               { $eq: ["$user", "$$userId"] },
    //               { $eq: ["$post", "$$postId"] },
    //             ],
    //           },
    //         },
    //       },
    //     ],
    //     as: "isLiked",
    //   },
    // },
    // {
    //   $lookup: {
    //     from: "saves",
    //     let: { postId: ObjectID(id), userId: ObjectID(userId) },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [
    //               { $eq: ["$user", "$$userId"] },
    //               { $eq: ["$post", "$$postId"] },
    //             ],
    //           },
    //         },
    //       },
    //     ],
    //     as: "isSaved",
    //   },
    // },

    {
      $addFields: {
        isFollow: {
          $cond: {
            if: { $eq: [{ $size: "$isFollow" }, 1] },
            then: true,
            else: false,
          },
        },

        // isLiked: {
        //   $cond: {
        //     if: { $eq: [{ $size: "$isLiked" }, 1] },
        //     then: true,
        //     else: false,
        //   },
        // },
        // isSaved: {
        //   $cond: {
        //     if: { $eq: [{ $size: "$isSaved" }, 1] },
        //     then: true,
        //     else: false,
        //   },
        // },
      },
    },
  ]);

  return post;
});

export default singlePost;
