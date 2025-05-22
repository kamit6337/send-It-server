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
    { $sort: { "posts.updatedAt": -1 } },
    { $skip: skip },
    { $limit: limit },
    // Replace root with the post itself
    { $replaceRoot: { newRoot: "$posts" } },
  ]);

  return followingPosts;
};

export default getFollowingPostsByUserId;
