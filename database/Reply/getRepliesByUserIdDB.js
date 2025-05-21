import Post from "../../models/PostModel.js";
import ObjectID from "../../lib/ObjectID.js";

const getRepliesByUserIdDB = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserId or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  // const replies = await Post.find({
  //   user: userId,
  //   replyPostId: { $ne: null },
  // })
  //   .sort({ updatedAt: -1 })
  //   .skip(skip)
  //   .limit(limit)
  //   .select("replyPostId")
  //   .populate({
  //     path: "replyPostId",
  //     populate: {
  //       path: "user",
  //       select: "_id name email photo",
  //     },
  //   })
  //   .lean();

  // const allReplies = replies.map((reply) => reply.replyPostId);

  // const userRepliesToPost = await Promise.all(
  //   allReplies.map((reply) => {
  //     const { _id } = reply;

  //     const replies = Post.find({
  //       user: userId,
  //       replyPostId: _id,
  //     })
  //       .sort({ updatedAt: -1 })
  //       .populate({
  //         path: "user",
  //         select: "_id name email photo",
  //       })
  //       .lean();

  //     return replies;
  //   })
  // );

  // const organisedUserReplies = allReplies.map((reply) => {
  //   const findAllReplies = userRepliesToPost.map(
  //     (userReply) => userReply.replyPostId?.toString() === reply._id?.toString
  //   );

  //   return {
  //     post: reply,
  //     replies: findAllReplies,
  //   };
  // });

  // return organisedUserReplies;

  const results = await Post.aggregate([
    {
      $match: {
        user: ObjectID(userId),
        replyPostId: { $ne: null },
      },
    },
    {
      $sort: { updatedAt: -1 },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "posts",
        localField: "replyPostId",
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
        from: "posts",
        let: { targetReplyPostId: "$replyPostId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", ObjectID(userId)] },
                  { $eq: ["$replyPostId", "$targetReplyPostId"] },
                ],
              },
            },
          },
          {
            $sort: { updatedAt: -1 },
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
        ],
        as: "userReplies",
      },
    },
    {
      $project: {
        _id: 0,
        post: "$post",
        replies: "$userReplies",
      },
    },
  ]);

  return results;

  // const replies = await Post.find({
  //   user: userId,
  //   replyPostId: { $ne: null },
  // })
  //   .sort({ updatedAt: -1 })
  //   .skip(skip)
  //   .limit(limit)
  //   .populate([
  //     { path: "user", select: "_id name email photo" },
  //     {
  //       path: "replyPostId",
  //       populate: { path: "user", select: "_id name email photo" },
  //     },
  //   ])
  //   .lean();

  return replies;
};

export default getRepliesByUserIdDB;
