import ObjectID from "../../utils/ObjectID.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const userFollowings = catchAsyncDBError(
  async (id, userId, { skip, limit }) => {
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

    return followingAggregate;
  }
);

export default userFollowings;
