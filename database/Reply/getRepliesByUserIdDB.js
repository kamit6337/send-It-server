import Post from "../../models/PostModel.js";

const getRepliesByUserIdDB = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserId or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const replies = await Post.find({
    user: userId,
    replyPostId: { $ne: null },
  })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate([
      { path: "user", select: "_id name email photo" },
      {
        path: "replyPostId",
        populate: { path: "user", select: "_id name email photo" },
      },
    ])
    .lean();

  return replies;
};

export default getRepliesByUserIdDB;
