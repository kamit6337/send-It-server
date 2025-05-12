import deleteLikesByPostIdDB from "../../database/Like/deleteLikesByPostIdDB.js";
import deletePostDB from "../../database/Post/deletePostDB.js";
import deleteReplyByPostIdDB from "../../database/Reply/deleteReplyByPostIdDB.js";
import deleteSavesByPostIdDB from "../../database/Save/deleteSavesByPostIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";

const deletePost = catchGraphQLError(async (parent, args, contextValue) => {
  await Req(contextValue.req);
  const { io } = socketConnect();

  const { id } = args;

  const promises = [
    deletePostDB(id),
    deleteLikesByPostIdDB(id),
    deleteSavesByPostIdDB(id),
    deleteReplyByPostIdDB(id),
  ];

  await Promise.all(promises);

  io.emit("delete-post", id);

  return "Post has been deleted successfully";
});

export default deletePost;
