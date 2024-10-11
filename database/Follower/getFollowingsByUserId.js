import Follower from "../../models/FollowerModel.js";
import ObjectID from "../../utils/ObjectID.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const getFollowingsByUserId = catchAsyncDBError(async (id, userId, page) => {
  const limit = 20;
  const skip = (page - 1) * limit;

  const followingAggregate = await Follower.aggregate([
    {
      $match: {
        user: { $ne: ObjectID(id) },
        follower: ObjectID(id),
      },
    },
    {
      $sort: { createdAt: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "followers", // The collection name
        let: { followedUserId: "$user", currentUserId: ObjectID(userId) },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$followedUserId"] },
                  // Check if the followed user is in the follower list of the current user
                  { $eq: ["$follower", "$$currentUserId"] },
                ],
              },
            },
          },
        ],
        as: "isActualUserFollow",
      },
    },
    {
      $addFields: {
        isActualUserFollow: {
          $cond: {
            if: { $eq: [{ $size: "$isActualUserFollow" }, 1] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $lookup: {
        from: "users", // Assuming the users collection name is 'users'
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
        _id: 1,
        "user._id": 1,
        "user.username": 1,
        "user.name": 1,
        "user.photo": 1,
        isActualUserFollow: 1,
      },
    },
  ]);

  return followingAggregate;
});

export default getFollowingsByUserId;
