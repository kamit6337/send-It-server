import ObjectID from "../../lib/ObjectID.js";
import Follower from "../../models/FollowerModel.js";

const getTopFollowedUsersDB = async (userId, page) => {
  if (!userId || !page) throw new Error("UserId or Page is not provided");

  const limit = 10;
  const skip = (page - 1) * limit;

  const results = await Follower.aggregate([
    {
      $group: {
        _id: "$user",
        followersCount: { $sum: 1 },
      },
    },
    {
      $match: {
        _id: { $ne: ObjectID(userId) },
      },
    },
    {
      $sort: { followersCount: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: "$user._id",
        name: "$user.name",
        email: "$user.email",
        photo: "$user.photo",
        followersCount: 1,
      },
    },
  ]);

  return results;
};

export default getTopFollowedUsersDB;
