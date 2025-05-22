import createPostDB from "../../database/Post/createPostDB.js";
import getSinglePostDB from "../../database/Post/getSinglePostDB.js";
import updatePostDB from "../../database/Post/updatePostDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
import { addReplyJob } from "../../queues/notificationQueues/replyQueue.js";
import convertIntoPostDetail from "../../utils/javaScript/convertIntoPostDetail.js";

const createPostReply = catchGraphQLError(
  async (parent, args, contextValue) => {
    const findUser = await Req(contextValue.req);
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
      user: findUser._id,
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

    const updatedPost = await updatePostDB(postId, updatePostObj);

    const modifyPostDetail = convertIntoPostDetail(updatedPost, findUser);

    const response = {
      ...createPostResult,
      user: {
        _id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        photo: findUser.photo,
      },
      isFollow: false,
    };

    io.emit("update-post-details", modifyPostDetail);

    io.emit("new-reply", response);

    const getPost = await getSinglePostDB(postId);

    const sender = {
      _id: findUser._id,
      name: findUser.name,
      email: findUser.email,
      photo: findUser.photo,
    };

    await addReplyJob(getPost.user._id, sender, getPost);

    return response;
  }
);

export default createPostReply;
