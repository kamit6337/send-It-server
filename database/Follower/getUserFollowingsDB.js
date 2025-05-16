import ObjectID from "../../lib/ObjectID.js";
import Follower from "../../models/FollowerModel.js";

const getUserFollowingsDB = async (actualUserId, userId, page) => {
  if (!actualUserId || !userId || !page) {
    throw new Error("ActualUserId or UserId or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const followings = await Follower.aggregate([
    {
      $match: { user: { $ne: ObjectID(userId) }, follower: ObjectID(userId) },
    },
    {
      $sort: { updatedAt: -1 },
    },
    { $skip: skip },
    { $limit: limit },
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
      $lookup: {
        from: "followers",
        let: {
          followingUserId: "$user._id",
          actualUserId: ObjectID(actualUserId),
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$followingUserId"] },
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
        "user.isFollowed": {
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
        _id: "$user._id",
        name: "$user.name",
        email: "$user.email",
        photo: "$user.photo",
        isFollowed: "$user.isFollowed",
      },
    },
  ]);

  return followings;
};

export default getUserFollowingsDB;
