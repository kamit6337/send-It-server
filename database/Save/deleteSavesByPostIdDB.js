import Save from "../../models/SaveModel.js";

const deleteSavesByPostIdDB = async (postId) => {
  if (!postId) throw new Error("PostId is not provided");

  const response = await Save.deleteMany({ post: postId });

  return response;
};

export default deleteSavesByPostIdDB;
