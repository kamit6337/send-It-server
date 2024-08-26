import Post from "../../models/PostModel.js";
import Save from "../../models/SaveModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import { v4 as uuidv4 } from "uuid";
import { sendNewSaveIO } from "../../socketIO/save.js";

const createNewSave = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId } = req.body;

  if (!postId) {
    return next(new HandleGlobalError("PostId is required", 404));
  }

  const like = Save.create({ user: userId, post: postId });
  const increase = Post.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: { saveCount: 1 },
    },
    {
      new: true,
      runValidators: true,
    }
  );

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
