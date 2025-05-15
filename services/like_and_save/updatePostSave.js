import updatePostDB from "../../database/Post/updatePostDB.js";
import createNewSaveDB from "../../database/Save/createNewSaveDB.js";
import deleteSavesByUserIdDB from "../../database/Save/deleteSavesByUserIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import Req from "../../lib/Req.js";
import socketConnect from "../../lib/socketConnect.js";
import convertIntoPostDetail from "../../utils/javaScript/convertIntoPostDetail.js";

const updatePostSave = catchGraphQLError(async (parent, args, contextValue) => {
  const findUser = await Req(contextValue.req);
  const { io } = socketConnect();

  const { toggle, id } = args;

  if (toggle) {
    await createNewSaveDB(findUser._id, id);

    const obj = {
      $inc: { saveCount: 1 },
    };

    const updatedPost = await updatePostDB(id, obj);

    const modifyPostDetail = convertIntoPostDetail(updatedPost, findUser);

    io.emit("update-post-details", modifyPostDetail);

    return "true";
  }

  await deleteSavesByUserIdDB(findUser._id, id);

  const obj = {
    $inc: { saveCount: -1 },
  };

  const updatedPost = await updatePostDB(id, obj);

  const modifyPostDetail = convertIntoPostDetail(updatedPost, findUser);
  io.emit("update-post-details", modifyPostDetail);

  return "false";
});

export default updatePostSave;
