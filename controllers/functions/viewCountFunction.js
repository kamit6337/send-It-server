import updatePostDB from "../../database/Post/updatePostDB.js";
import { addPostId, isPostIdPresent } from "../../redis/View/viewCountRedis.js";
import { sendNewViewIO } from "../../socketIO/view.js";

const viewCountFunction = async (postId) => {
  const checkPostId = await isPostIdPresent(postId);

  if (checkPostId) return;

  const obj = {
    $inc: { viewCount: 1 },
  };

  await updatePostDB(postId, obj);

  await addPostId(postId);

  sendNewViewIO({ postId: postId });
};

export default viewCountFunction;
