import createNewLikeDB from "../../database/Like/createNewLikeDB.js";
import deleteLikesByUserIdDB from "../../database/Like/deleteLikesByUserIdDB.js";
import getSinglePostDB from "../../database/Post/getSinglePostDB.js";
import updatePostDB from "../../database/Post/updatePostDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
import { addLikeJob } from "../../queues/notificationQueues/likeQueue.js";
import convertIntoPostDetail from "../../utils/javaScript/convertIntoPostDetail.js";

const updatePostLike = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);
  const { io } = socketConnect();

  const { toggle, id } = args;

  if (toggle) {
    await createNewLikeDB(findUser._id, id);

    const obj = {
      $inc: { likeCount: 1 },
    };

    const updatedPost = await updatePostDB(id, obj);

    const modifyPostDetail = convertIntoPostDetail(updatedPost, findUser);

    const getPost = await getSinglePostDB(id);

    io.emit("update-post-details", modifyPostDetail);

    const sender = {
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      photo: findUser.photo,
    };

    await addLikeJob(getPost.user._id, sender, getPost);
    return "true";
  }

  await deleteLikesByUserIdDB(findUser._id, id);

  const obj = {
    $inc: { likeCount: -1 },
  };

  const updatedPost = await updatePostDB(id, obj);

  const modifyPostDetail = convertIntoPostDetail(updatedPost, findUser);
  io.emit("update-post-details", modifyPostDetail);

  return "false";
});

export default updatePostLike;
