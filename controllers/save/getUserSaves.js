import Save from "../../models/SaveModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";

const getUserSaves = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId } = req.query;

  if (!postId) {
    return next(new HandleGlobalError("PostId is required", 404));
  }

  const saved = await Save.findOne({ user: userId, post: postId }).lean();

  res.send(!!saved);
});

export default getUserSaves;
