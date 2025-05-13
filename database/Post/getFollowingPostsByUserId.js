import Follower from "../../models/FollowerModel.js";
import ObjectID from "../../lib/ObjectID.js";

const getFollowingPostsByUserId = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserId or page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const followingPosts = await Follower.aggregate([
    { $match: { follower: ObjectID(userId) } },
    {
      $lookup: {
        from: "posts",
        localField: "user",
        foreignField: "user",
        as: "posts",
      },
    },
    { $unwind: "$posts" },
    { $match: { "posts.ofReply": false } },
    { $sort: { "posts.createdAt": -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "posts.user",
        foreignField: "_id",
        as: "posts.user",
      },
    },
    { $unwind: "$posts.user" },
    {
      $replaceRoot: {
        newRoot: "$posts", // Replace the root document with the posts document
      },
    },
    {
      $project: {
        _id: 1,
        message: 1,
        media: 1,
        createdAt: 1,
        updatedAt: 1,
        "user._id": 1,
        "user.name": 1,
        "user.email": 1,
        "user.photo": 1,
      },
    },
  ]);

  return followingPosts;
};

export default getFollowingPostsByUserId;
