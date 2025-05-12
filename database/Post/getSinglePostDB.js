import Post from "../../models/PostModel.js";
import ObjectID from "../../lib/ObjectID.js";

const getSinglePostDB = async (userId, postId) => {
  if (!userId || !postId) {
    throw new Error("UserId or PostId is not provided");
  }

  const post = await Post.aggregate([
    {
      $match: {
        _id: ObjectID(postId),
      },
    },
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
        _id: 1,
        message: 1, // Include the post's message
        media: 1, // Include the post's media URL
        createdAt: 1, // Include the post's creation date
        updatedAt: 1, // Include the post's update date
        "user._id": 1,
        "user.email": 1,
        "user.name": 1,
        "user.photo": 1,
      },
    },
  ]);

  return post[0];
};

export default getSinglePostDB;
