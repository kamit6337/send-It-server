import Save from "../../models/SaveModel.js";
import { updatePostSave } from "../../redis/Save/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const createSave = catchAsyncDBError(async (userId, postId) => {
  await Save.create({ user: userId, post: postId });
  await updatePostSave(userId, postId, true);
});

export default createSave;
