import createPostDB from "../../database/Post/createPostDB.js";
import getSinglePostDB from "../../database/Post/getSinglePostDB.js";
import updatePostDetailDB from "../../database/Post/updatePostDetailDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import socketConnect from "../../lib/socketConnect.js";
import { addReplyJob } from "../../queues/notificationQueues/replyQueue.js";

const createPostReply = catchGraphQLError(async (parent, args, { user }) => {
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
    replyPostId: postId,
  };

  const createPostResult = await createPostDB(obj);

  const updatePostObj = {
    $inc: { replyCount: 1 },
  };

  const updatedPost = await updatePostDetailDB(postId, updatePostObj);

  const response = {
    ...createPostResult,
    user: {
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      photo: findUser.photo,
    },
  };

  io.emit("update-post-details", updatedPost);

  io.emit("new-reply", response);

  const getPost = await getSinglePostDB(postId);

  const sender = {
    _id: findUser._id,
    name: findUser.name,
    email: findUser.email,
    photo: findUser.photo,
  };

  if (user._id?.toString() !== getPost.user?.toString()) {
    await addReplyJob(getPost.user, sender, getPost);
  }
  return response;
});

export default createPostReply;
