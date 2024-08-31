import Reply from "../../models/ReplyModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getPostReplies = catchAsyncError(async (req, res, next) => {
  const { id, page = 1 } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Post ID is not provided", 404));
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const replies = await Reply.find({
    post: id,
  })
    .sort("-updatedAt")
    .skip(skip)
    .limit(limit)
    .populate({
      path: "replyPost",
      populate: {
        path: "user",
        model: "User",
        select: "_id username name photo",
      },
    });

  res.json(replies);
});

export default getPostReplies;
