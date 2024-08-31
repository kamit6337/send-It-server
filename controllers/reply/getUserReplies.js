import userReplies from "../../database/Reply/userReplies.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getUserReplies = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1, id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("User ID in not provided", 404));
  }

  const replies = await userReplies(userId, id, page);

  res.json(replies);
});

export default getUserReplies;
