import Follower from "../../models/FollowerModel.js";
import ObjectID from "../../lib/ObjectID.js";

const getFollowingPostsByUserId = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserId or page is not provided");
  }

  const limit = 10;
  const skip = (page - 1) * limit;

  const followingPosts = await Follower.aggregate([
    // find all my followings includes myself
    { $match: { follower: ObjectID(userId) } },

    // fill the posts of followings including mine posts also
    {
      $lookup: {
        from: "posts",
        localField: "user",
        foreignField: "user",
        as: "posts",
      },
    },
    { $unwind: "$posts" },

    // make posts as main object, replace followers fields
    { $replaceRoot: { newRoot: "$posts" } },

    // fill replyPost if having, as postReply
    {
      $lookup: {
        from: "posts",
        localField: "replyPost",
        foreignField: "_id",
        as: "postReply",
      },
    },
    {
      $unwind: {
        path: "$postReply",
        preserveNullAndEmptyArrays: true,
      },
    },

    // check whether i (actualUser) follow my posts replyPost.user or not
    {
      $lookup: {
        from: "followers",
        let: {
          actualUser: ObjectID(userId),
          postReplyUser: "$postReply.user",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$postReplyUser"] },
                  { $eq: ["$follower", "$$actualUser"] },
                ],
              },
            },
          },
        ],
        as: "followsReplyUser",
      },
    },

    // if i follow, then add new field with false while make everyone else as true, to easy to filter later
    {
      $addFields: {
        doIFollowReplyUser: {
          $cond: {
            if: {
              $gt: [{ $size: "$followsReplyUser" }, 0],
            },
            then: true,
            else: false,
          },
        },
      },
    },

    // match is true, because i don't want to include my posts that i follow replyPost.user
    {
      $match: {
        $nor: [
          {
            $and: [{ doIFollowReplyUser: true }],
          },
        ],
      },
    },
    { $sort: { updatedAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        postReply: 0,
        followsReplyUser: 0,
        doIFollowReplyUser: 0,
      },
    },
  ]);

  return followingPosts;
};

export default getFollowingPostsByUserId;
