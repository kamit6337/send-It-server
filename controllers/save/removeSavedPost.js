import Post from "../../models/PostModel.js";
import Save from "../../models/SaveModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import { io } from "../../app.js";
import { v4 as uuidv4 } from "uuid";

const removeSavedPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId } = req.query;

  if (!postId) {
    return next(new HandleGlobalError("PostId is required", 404));
  }

  const like = Save.deleteOne({ user: userId, post: postId });

  const decrease = Post.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: { saveCount: -1 },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  await Promise.all([like, decrease]);

  const obj = {
    _id: uuidv4(),
    user: userId,
    post: postId,
  };

  io.emit("removeSave", obj);

  res.json({
    message: "remove save",
  });
});

export default removeSavedPost;
