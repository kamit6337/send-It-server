import Save from "../../models/SaveModel.js";
import { checkPostSave, createPostSave } from "../../redis/Save/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const isUserSavePost = catchAsyncDBError(async (userId, postId) => {
  const checkSave = await checkPostSave(userId, postId);

  if (checkSave) return checkSave.isSaved;

  const saved = await Save.exists({ user: userId, post: postId });

  await createPostSave(userId, postId, !!saved);

  return !!saved;
});

export default isUserSavePost;
