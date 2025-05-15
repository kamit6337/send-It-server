import Save from "../../models/SaveModel.js";

const getUserSavePostsDB = async (userId, page) => {
  if (!userId || !page) {
    throw new Error("UserID or Page is not provided");
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const savePosts = await Save.find({
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

  if (savePosts.length === 0) {
    return [];
  }

  const posts = savePosts.map((save) => save.post);

  return posts;
};

export default getUserSavePostsDB;
