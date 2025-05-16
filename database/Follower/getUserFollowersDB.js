import ObjectID from "../../lib/ObjectID.js";
import Follower from "../../models/FollowerModel.js";

const getUserFollowersDB = async (actualUserId, userId, page) => {
  if (!actualUserId || !userId || !page) {
    throw new Error("ActualUserId or UserId or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const followers = await Follower.aggregate([
    {
      $match: { user: ObjectID(userId), follower: { $ne: ObjectID(userId) } },
    },
    {
      $sort: { updatedAt: -1 },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "follower",
        foreignField: "_id",
        as: "follower",
      },
    },
    {
      $unwind: "$follower",
    },
    {
      $lookup: {
        from: "followers",
        let: {
          followedUserId: "$follower._id",
          actualUserId: ObjectID(actualUserId),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$followedUserId"] },
                  // Check if the followed user is in the follower list of the current user
                  { $eq: ["$follower", "$$actualUserId"] },
                ],
              },
            },
          },
        ],
        as: "isFollowed",
      },
    },
    {
      $addFields: {
        "follower.isFollowed": {
          $cond: {
            if: { $eq: [{ $size: "$isFollowed" }, 1] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: "$follower._id",
        name: "$follower.name",
        email: "$follower.email",
        photo: "$follower.photo",
        isFollowed: "$follower.isFollowed",
      },
    },
  ]);

  return followers;
};

export default getUserFollowersDB;
