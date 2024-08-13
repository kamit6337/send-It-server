import Follower from "../../../models/FollowerModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";
import ObjectID from "../../../utils/ObjectID.js";

const getUserFollower = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1, id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Pleae provide user id", 404));
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const objectId = ObjectID(id);

  const followersAggregate = await Follower.aggregate([
    {
      $match: {
        user: objectId, // Exclude the user themselves from the following list
        follower: { $ne: objectId }, // Current user's followers
      },
    },
    {
      $lookup: {
        from: "followers", // The collection name
        let: { followedUserId: "$follower", currentUserId: ObjectID(userId) },
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
        localField: "follower",
        foreignField: "_id",
        as: "follower",
      },
    },
    {
      $unwind: "$follower",
    },
    {
      $project: {
        _id: 1,
        "follower._id": 1,
        "follower.username": 1,
        "follower.name": 1,
        "follower.photo": 1,
        isActualUserFollow: 1,
      },
    },
  ]);

  res.json({
    message: "user followers",
    page: page,
    data: followersAggregate,
  });
});

export default getUserFollower;
