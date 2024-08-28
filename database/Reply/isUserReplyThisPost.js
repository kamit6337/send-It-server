import Reply from "../../models/ReplyModel.js";
import { checkPostReply, createPostReply } from "../../redis/Reply/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";
import ObjectID from "../../utils/ObjectID.js";

const isUserReplyThisPost = catchAsyncDBError(async (userId, postId) => {
  const checkReply = await checkPostReply(userId, postId);

  if (checkReply) return checkReply.isReplied;

  const result = await Reply.aggregate([
    {
      $match: {
        post: ObjectID(postId),
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
      $unwind: "$replyPost",
    },
    {
      $match: {
        "replyPost.user": ObjectID(userId),
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        hasMatchingReply: { $gt: ["$count", 0] },
      },
    },
  ]);

  const hasMatchingReply = result.length > 0 && result[0].hasMatchingReply;

  await createPostReply(userId, postId, hasMatchingReply);

  return hasMatchingReply;
});

export default isUserReplyThisPost;
