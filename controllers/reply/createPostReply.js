import Post from "../../models/PostModel.js";
import Reply from "../../models/ReplyModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const createPostReply = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { postId, message, media } = req.body;

  if (!postId) {
    return next(new HandleGlobalError("Post ID must be provided", 404));
  }

  if (!message && !media) {
    return next(new HandleGlobalError("Message or media is needed", 404));
  }

  const post = await Post.create({
    user: userId,
    message,
    media,
  });

  const reply = await Reply.create({
    user: userId,
    post: postId,
    replyPost: post._id.toString(),
  });

  res.json({
    message: "Reply created",
    data: reply,
  });
});

export default createPostReply;
