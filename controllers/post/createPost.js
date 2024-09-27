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

  const obj = {
    message,
    media,
    duration,
    thumbnail,
  };

  const post = await createNewPost(user._id, obj);

  const modifyPost = {
    _id: post._id,
    message: post.message,
    media: post.media,
    user: {
      _id: user._id,
      username: user.username,
      name: user.name,
      photo: user.photo,
    },
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };

  sendNewPostIO(modifyPost);

  res.json({
    message: "Post created",
  });
});

export default createPost;
