import { io } from "../../app.js";
import Post from "../../models/PostModel.js";
import Reply from "../../models/ReplyModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const updateReplyPost = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const { id, message, media } = req.body;

  if (!id) {
    return next(
      new HandleGlobalError("Please provide repkyId and PostId", 404)
    );
  }

  if (!message && !media) {
    return next(
      new HandleGlobalError("Please provide message or media atleast", 404)
    );
  }

  const findReply = await Reply.findOne({ replyPost: id }).lean();

  const obj = {};

  if (message) obj.message = message;
  if (media) obj.media = media;

  const updatePost = await Post.findOneAndUpdate(
    {
      _id: id,
    },
    {
      ...obj,
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  const replyObj = {
    ...findReply,
    replyPost: {
      ...updatePost,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        photo: user.photo,
      },
    },
  };

  io.emit("newReply", replyObj);

  res.json({
    message: "Reply Post updated",
    data: findReply.post,
  });
});

export default updateReplyPost;
