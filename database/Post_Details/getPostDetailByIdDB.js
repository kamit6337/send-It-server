import PostDetail from "../../models/PostDetailModel.js";

const getPostDetailByIdDB = async (ids) => {
  if (!Array.isArray(ids) || ids.length === 0)
    throw new Error("Ids is not provided");

  const results = await PostDetail.find({
    post: { $in: ids },
  }).lean();

  return results;
};

export default getPostDetailByIdDB;
