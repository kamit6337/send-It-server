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
    .lean();

  return savePosts;
};

export default getUserSavePostsDB;
