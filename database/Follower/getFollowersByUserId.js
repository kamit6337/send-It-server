import Follower from "../../models/FollowerModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";
import ObjectID from "../../utils/ObjectID.js";

const getFollowersByUserId = catchAsyncDBError(
  async (userId, id, { limit, skip }) => {
    const followersAggregate = await Follower.aggregate([
      {
        $match: {
          user: ObjectID(id), // Exclude the user themselves from the following list
          follower: { $ne: ObjectID(id) }, // Current user's followers
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

    return followersAggregate;
  }
);

export default getFollowersByUserId;
