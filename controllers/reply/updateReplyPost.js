import updatePostDB from "../../database/Post/updatePostDB.js";
import getReplyByReplyPostID from "../../database/Reply/getReplyByReplyPostID.js";
import { sendUpdatedReplyIO } from "../../socketIO/reply.js";
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

  const findReply = await getReplyByReplyPostID(id);

  const obj = {};

  if (message) obj.message = message;
  if (media) obj.media = media;

  const updatePost = await updatePostDB(id, obj);

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

  sendUpdatedReplyIO(replyObj);

  res.json({
    message: "Reply Post updated",
  });
});

export default updateReplyPost;
