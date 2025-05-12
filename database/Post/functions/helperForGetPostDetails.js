import ObjectID from "../../../lib/ObjectID.js";

export const lookupIsFollow = (userId) => [
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
      isFollow: {
        $cond: {
          if: { $eq: [{ $size: "$isFollow" }, 1] },
          then: true,
          else: false,
        },
      },
    },
  },
];

export const lookupIsLiked = (userId) => [
  {
    $lookup: {
      from: "likes",
      let: { user: ObjectID(userId), post: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$user", "$$user"] },
                { $eq: ["$post", "$$post"] },
              ],
            },
          },
        },
      ],
      as: "isLiked",
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
    },
  },
];

export const lookupIsSaved = (userId) => [
  {
    $lookup: {
      from: "saves",
      let: { user: ObjectID(userId), post: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$user", "$$user"] },
                { $eq: ["$post", "$$post"] },
              ],
            },
          },
        },
      ],
      as: "isSaved",
    },
  },
  {
    $addFields: {
      isSaved: {
        $cond: {
          if: { $eq: [{ $size: "$isSaved" }, 1] },
          then: true,
          else: false,
        },
      },
    },
  },
];
