import Save from "../../models/SaveModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const createSave = catchAsyncDBError(async (userId, postId) => {
  await Save.create({ user: userId, post: postId });
});

export default createSave;
