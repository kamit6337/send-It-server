import Post from "../../models/PostModel.js";

const getMediaPostsByUserIdDB = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserID or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const posts = await Post.find({
    user: userId,
    media: { $ne: "" },
  })
    .sort("-updatedAt")
    .skip(skip)
    .limit(limit)
    .lean();

  return posts;
};

export default getMediaPostsByUserIdDB;
