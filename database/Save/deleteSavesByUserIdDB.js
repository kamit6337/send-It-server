import Save from "../../models/SaveModel.js";

const deleteSavesByUserIdDB = async (userId, postId) => {
  if (!userId || !postId) {
    throw new Error("UserId or PostId is not provided");
  }

  const checkAlreadySave = await Save.exists({ user: userId, post: postId });

  if (!checkAlreadySave) throw new Error("Post is not Saved by User");

  const response = await Save.deleteMany({ user: userId, post: postId });

  return response;
};

export default deleteSavesByUserIdDB;
