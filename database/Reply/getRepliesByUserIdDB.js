import Post from "../../models/PostModel.js";

const getRepliesByUserIdDB = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserId or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const posts = await Post.find({
    user: userId,
    replyPost: { $ne: null },
  })
    .sort("-updatedAt")
    .skip(skip)
    .limit(limit)
    .lean();

  return posts;
};

export default getRepliesByUserIdDB;
