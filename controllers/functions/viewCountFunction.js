import updatePostDB from "../../database/Post/updatePostDB.js";
import { sendNewViewIO } from "../../socketIO/view.js";

const viewCountFunction = async (postId) => {
  const obj = {
    $inc: { viewCount: 1 },
  };

  await updatePostDB(postId, obj);

  sendNewViewIO({ postId: postId });
};

export default viewCountFunction;
