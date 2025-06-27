import createNewLikeDB from "../../database/Like/createNewLikeDB.js";
import deleteLikesByUserIdDB from "../../database/Like/deleteLikesByUserIdDB.js";
import getSinglePostDB from "../../database/Post/getSinglePostDB.js";
import updatePostDetailDB from "../../database/Post/updatePostDetailDB.js";
import userLikeCount from "../../database/Post_Details/userLikeCount.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
import { addNotificationJob } from "../../queues/notificationQueues/notificationQueue.js";

const updatePostLike = catchGraphQLError(async (parent, args, { req }) => {
  const user = await Req(req);

  const { io } = socketConnect();

  const { toggle, id: postId } = args;

  if (toggle) {
    await createNewLikeDB(user._id, postId);

    const obj = {
      $inc: { likeCount: 1 },
    };

    const updatedPostDetail = await updatePostDetailDB(postId, obj);

    io.emit("update-post-details", updatedPostDetail);

    const getPost = await getSinglePostDB(postId);

    const sender = {
      _id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo,
    };

    if (user._id?.toString() !== getPost.user?.toString()) {
      // await addLikeJob(getPost.user, sender, getPost);
      await addNotificationJob(getPost.user, "like", { sender, post: getPost });
    }

    const likePostCount = await userLikeCount(user._id);

    return {
      bool: "true",
      count: likePostCount,
    };
  }

  await deleteLikesByUserIdDB(user._id, postId);

  const obj = {
    $inc: { likeCount: -1 },
  };

  const updatedPost = await updatePostDetailDB(postId, obj);

  io.emit("update-post-details", updatedPost);

  const likePostCount = await userLikeCount(user._id);

  return {
    bool: "false",
    count: likePostCount,
  };
});

export default updatePostLike;
