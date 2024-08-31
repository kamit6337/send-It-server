import Reply from "../../models/ReplyModel.js";
import ObjectID from "../../utils/ObjectID.js";

const getSingleReply = async (userId, postId) => {
  const reply = await Reply.aggregate([
    {
      $match: {
        replyPost: ObjectID(postId),
      },
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
        "post.createdAt": 1, // Include the post's creation date
        "post.updatedAt": 1, // Include the post's update date

        "replyPost.user._id": 1,
        "replyPost.user.username": 1,
        "replyPost.user.name": 1,
        "replyPost.user.photo": 1,
        "replyPost._id": 1,
        "replyPost.message": 1, // Include the replyPost's message
        "replyPost.media": 1, // Include the replyPost's media URL
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
      $addFields: {
        "post.isFollow": {
          $cond: {
            if: { $eq: [{ $size: "$post.isFollow" }, 1] },
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

  return reply[0];
};

export default getSingleReply;
