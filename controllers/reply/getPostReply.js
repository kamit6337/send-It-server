import getSingleReply from "../../database/Reply/getSingleReply.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getPostReply = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id: postId } = req.query;

  if (!postId) {
    return next(new HandleGlobalError("Post Id is not provided", 404));
  }

  const reply = await getSingleReply(userId, postId);

  res.json(reply);
});

export default getPostReply;
