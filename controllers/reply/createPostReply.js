import Post from "../../models/PostModel.js";
import Reply from "../../models/ReplyModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { sendNewReplyIO } from "../../socketIO/reply.js";

const createPostReply = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const user = req.user;

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
    ofReply: true,
  });

  const reply = await Reply.create({
    user: userId,
    post: postId,
    replyPost: post._id.toString(),
  });

  const obj = {
    _id: reply._id,
    post: postId,
    replyPost: {
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        photo: user.photo,
      },
      _id: post._id,
      message: post.message,
      media: post.media,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    },
  };

  sendNewReplyIO(obj);

  res.json({
    message: "Reply created",
  });
});

export default createPostReply;
