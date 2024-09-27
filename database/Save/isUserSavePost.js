import Save from "../../models/SaveModel.js";
import catchAsyncDBError from "../../utils/catchAsyncDBError.js";

const isUserSavePost = catchAsyncDBError(async (userId, postId) => {
  const saved = await Save.exists({ user: userId, post: postId });

  return !!saved;
});

export default isUserSavePost;
