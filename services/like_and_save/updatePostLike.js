import createNewLikeDB from "../../database/Like/createNewLikeDB.js";
import deleteLikesByUserIdDB from "../../database/Like/deleteLikesByUserIdDB.js";
import updatePostDB from "../../database/Post/updatePostDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
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

    io.emit("update-post-details", modifyPostDetail);

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
