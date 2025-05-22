import ObjectID from "../../lib/ObjectID.js";
import Follower from "../../models/FollowerModel.js";

const getUserFollowingsDB = async (userId, page) => {
  if (!userId || !page) {
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
      $project: {
        _id: "$user._id",
        name: "$user.name",
        email: "$user.email",
        photo: "$user.photo",
      },
    },
  ]);

  return followings;
};

export default getUserFollowingsDB;
