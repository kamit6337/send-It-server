import Like from "../../models/LikeModel.js";

const getUserLikePostsDB = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserID or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const likePosts = await Like.find({
    user: userId,
  })
    .sort("-updatedAt")
    .skip(skip)
    .limit(limit)
    .populate({
      path: "post",
      populate: {
        path: "user", // this is the user inside the Post
        select: "_id name email photo",
      },
    })

    .lean();

  if (likePosts.length === 0) {
    return [];
  }

  const posts = likePosts.map((like) => like.post);

  return posts;
};

export default getUserLikePostsDB;
