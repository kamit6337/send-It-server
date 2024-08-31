import Save from "../../models/SaveModel.js";
// import { updatePostSave } from "../../redis/Save/index.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const removeSave = catchAsyncDBError(async (userId, postId) => {
  await Save.deleteOne({ user: userId, post: postId });
  // await updatePostSave(userId, postId, true);
});

export default removeSave;
