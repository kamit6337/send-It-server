import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { sendNewPostIO } from "../../socketIO/post.js";
import createNewPost from "../../database/Post/createNewPost.js";

const createPost = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const { message = "", media = "", duration = 0, thumbnail = "" } = req.body;

  if (!message && !media) {
    return next(new HandleGlobalError("All fields is required", 404));
  }

  const post = await createNewPost(user, {
    message,
    media,
    duration,
    thumbnail,
  });

  sendNewPostIO(post);

  res.json({
    message: "Post created",
  });
});

export default createPost;
