import Reply from "../../../models/ReplyModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";

const getUserReplies = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const replies = await Reply.find({
    user: userId,
  })
    .sort("-updatedAt")
    .skip(skip)
    .limit(limit)
    .populate({ path: "replyPost" })
    .populate({
      path: "post",
      populate: {
        path: "user",
        model: "User",
        select: "username name photo",
      },
    });

  res.json({
    message: "User replies",
    page,
    data: replies,
  });
});

export default getUserReplies;
