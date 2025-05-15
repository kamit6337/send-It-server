import Save from "../../models/SaveModel.js";

const createNewSaveDB = async (userId, postId) => {
  if (!userId || !postId) {
    throw new Error("UserId or PostId is not provided");
  }

  const checkAlreadySave = await Save.exists({ user: userId, post: postId });

  if (checkAlreadySave) throw new Error("Already Save the post");

  const newSave = await Save.create({ user: userId, post: postId });

  return newSave;
};

export default createNewSaveDB;
