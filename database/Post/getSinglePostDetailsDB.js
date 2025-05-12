import Post from "../../models/PostModel.js";
import ObjectID from "../../lib/ObjectID.js";
import {
  lookupIsFollow,
  lookupIsLiked,
  lookupIsSaved,
} from "./functions/helperForGetPostDetails.js";

const getSinglePostDetailsDB = async (userId, postId) => {
  if (!userId || !postId) {
    throw new Error("UserId or PostId is not provided");
  }

  const pipeline = [
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
        replyCount: 1, // Include the post's message
        likeCount: 1, // Include the post's message
        viewCount: 1, // Include the post's media URL
        saveCount: 1, // Include the post's media URL
        retweetCount: 1, // Include the post's media URL
        createdAt: 1, // Include the post's creation date
        updatedAt: 1, // Include the post's update date
        "user._id": 1,
        "user.name": 1,
        "user.photo": 1,
        "user.email": 1,
      },
    },
    ...lookupIsFollow(userId),
    ...lookupIsLiked(userId),
    ...lookupIsSaved(userId),
  ];

  const post = await Post.aggregate(pipeline);

  return post[0];
};

export default getSinglePostDetailsDB;
