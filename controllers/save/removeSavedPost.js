import catchAsyncError from "../../utils/catchAsyncError.js";
import { v4 as uuidv4 } from "uuid";
import { removeSaveIO } from "../../socketIO/save.js";
import updatePostSaveCount from "../../database/Post/updatePostSaveCount.js";
import removeSave from "../../database/Save/removeSave.js";
import viewCountFunction from "../functions/viewCountFunction.js";

const removeSavedPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId } = req.query;

  if (!postId) {
    return next(new HandleGlobalError("PostId is required", 404));
  }

  const like = removeSave(userId, postId);
  const decrease = updatePostSaveCount(postId, -1);
  const viewCount = viewCountFunction(postId);

  await Promise.all([like, decrease, viewCount]);

  const obj = {
    _id: uuidv4(),
    user: userId,
    post: postId,
  };

  removeSaveIO(obj);

  res.json({
    message: "remove save",
  });
});

export default removeSavedPost;
