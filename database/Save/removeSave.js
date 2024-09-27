import Save from "../../models/SaveModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const removeSave = catchAsyncDBError(async (userId, postId) => {
  await Save.deleteOne({ user: userId, post: postId });
});

export default removeSave;
