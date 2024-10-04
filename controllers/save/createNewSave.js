import catchAsyncError from "../../utils/catchAsyncError.js";
import { v4 as uuidv4 } from "uuid";
import { sendNewSaveIO } from "../../socketIO/save.js";
import updatePostSaveCount from "../../database/Post/updatePostSaveCount.js";
import createSave from "../../database/Save/createSave.js";

const createNewSave = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId } = req.body;

  if (!postId) {
    return next(new HandleGlobalError("PostId is required", 404));
  }

  const like = createSave(userId, postId);
  const increase = updatePostSaveCount(postId, 1);

  await Promise.all([like, increase]);

  const obj = {
    _id: uuidv4(),
    user: userId,
    post: postId,
  };

  sendNewSaveIO(obj);

  res.json({
    message: "Save the post",
  });
});

export default createNewSave;
