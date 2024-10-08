import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { sendNewReplyIO } from "../../socketIO/reply.js";
import createNewPost from "../../database/Post/createNewPost.js";
import createNewReply from "../../database/Reply/createNewReply.js";
import updatePostReplyCount from "../../database/Post/updatePostReplyCount.js";

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

  const obj = {
    message,
    media,
    ofReply: true,
  };

  const post = await createNewPost(userId, obj);

  const promises = [
    createNewReply(userId, postId, post._id.toString()),
    updatePostReplyCount(postId),
  ];

  const [reply] = await Promise.all(promises);

  const modifyReply = {
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

  sendNewReplyIO(modifyReply);

  res.json({
    message: "Reply created",
  });
});

export default createPostReply;
