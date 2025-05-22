import ObjectID from "../../lib/ObjectID.js";
import Follower from "../../models/FollowerModel.js";

const getUserFollowersDB = async (userId, page) => {
  if (!userId || !page) {
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
      $project: {
        _id: "$follower._id",
        name: "$follower.name",
        email: "$follower.email",
        photo: "$follower.photo",
      },
    },
  ]);

  return followers;
};

export default getUserFollowersDB;
