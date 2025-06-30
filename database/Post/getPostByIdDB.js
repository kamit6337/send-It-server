import Post from "../../models/PostModel.js";

const getPostByIdDB = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0)
    throw new Error("Ids is not provided");

  const posts = await Post.find({
    _id: { $in: ids },
  }).lean();

  return posts;
};

export default getPostByIdDB;
