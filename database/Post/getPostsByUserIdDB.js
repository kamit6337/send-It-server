import Post from "../../models/PostModel.js";

const getPostsByUserIdDB = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserID or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const posts = await Post.find({
    user: userId,
    replyPostId: null,
  })
    .sort("-updatedAt")
    .skip(skip)
    .limit(limit)
    .populate({
      path: "user",
      select: "_id name email photo",
    })
    .lean();

  return posts;
};

export default getPostsByUserIdDB;
