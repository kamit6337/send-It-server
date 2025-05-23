import updatePostDetailDB from "../../database/Post/updatePostDetailDB.js";
import userSavePostCount from "../../database/Post_Details/userSavePostCount.js";
import createNewSaveDB from "../../database/Save/createNewSaveDB.js";
import deleteSavesByUserIdDB from "../../database/Save/deleteSavesByUserIdDB.js";
import catchGraphQLError from "../../lib/catchGraphQLError.js";
import socketConnect from "../../lib/socketConnect.js";

const updatePostSave = catchGraphQLError(async (parent, args, { user }) => {
  const { io } = socketConnect();

  const { toggle, id } = args;

  if (toggle) {
    await createNewSaveDB(user._id, id);

    const obj = {
      $inc: { saveCount: 1 },
    };

    const updatedPost = await updatePostDetailDB(id, obj);

    io.emit("update-post-details", updatedPost);

    const savePostCount = await userSavePostCount(user._id);

    return {
      bool: "true",
      count: savePostCount,
    };
  }

  await deleteSavesByUserIdDB(user._id, id);

  const obj = {
    $inc: { saveCount: -1 },
  };

  const updatedPost = await updatePostDetailDB(id, obj);

  io.emit("update-post-details", updatedPost);

  const savePostCount = await userSavePostCount(user._id);

  return {
    bool: "false",
    count: savePostCount,
  };
});

export default updatePostSave;
