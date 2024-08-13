import Follower from "../../../models/FollowerModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import HandleGlobalError from "../../../utils/HandleGlobalError.js";
import ObjectID from "../../../utils/ObjectID.js";

const getUserFollowing = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1, id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Pleae provide user id", 404));
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const objectId = ObjectID(id);

  const followingAggregate = await Follower.aggregate([
    {
      $match: {
        user: { $ne: objectId }, // Exclude the user themselves from the following list
        follower: objectId, // Current user's followers
      },
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
      $skip: skip,
    },
    {
      $limit: limit,
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

  res.json({
    message: "user following",
    page: page,
    data: followingAggregate,
  });
});

export default getUserFollowing;
