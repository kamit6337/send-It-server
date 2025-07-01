import checkAlreadyPostNotificationDB from "../../database/Notification/checkAlreadyPostNotificationDB.js";
import createPostDB from "../../database/Post/createPostDB.js";
import getPostByIdDB from "../../database/Post/getPostByIdDB.js";
import updatePostDetailDB from "../../database/Post/updatePostDetailDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
import { addNotificationJob } from "../../queues/notificationQueues/notificationQueue.js";

const createPostReply = catchGraphQLError(async (parent, args, { req }) => {
  const user = await Req(req);

  const { io } = socketConnect();

  const {
    postId,
    message = "",
    media = "",
    duration = 0,
    thumbnail = "",
  } = args;

  if (!postId) {
    throw new Error("PostId is not provided");
  }

  if (!message && !media) {
    throw new Error("Message or Media is not provided");
  }

  const obj = {
    user: user._id,
    message,
    media,
    duration,
    thumbnail,
    replyPost: postId,
  };

  const createPostResult = await createPostDB(obj);

  const updatePostObj = {
    $inc: { replyCount: 1 },
  };

  const updatedPost = await updatePostDetailDB(postId, updatePostObj);

  const response = {
    ...createPostResult,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
    },
  };

  io.emit("update-post-details", updatedPost);

  io.emit("new-reply", response);

  const getPost = await getPostByIdDB([postId]);

  if (user._id?.toString() !== getPost[0].user?.toString()) {
    const needToSendNotification = await checkAlreadyPostNotificationDB(
      user._id,
      postId
    );

    if (!needToSendNotification) {
      await addNotificationJob(getPost[0].user, "reply", {
        sender: user._id,
        post: postId,
      });
    }
  }
  return "Post reply has been created";
});

export default createPostReply;
