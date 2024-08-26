import Post from "../../models/PostModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";
import { sendNewPostIO } from "../../socketIO/post.js";

const createPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const user = req.user;

  const { message = "", media = "", duration = 0, thumbnail = "" } = req.body;

  if (!message && !media) {
    return next(new HandleGlobalError("All fields is required", 404));
  }

  const post = await Post.create({
    user: userId,
    message,
    media,
    thumbnail,
    duration,
  });

  const obj = {
    _id: post._id,
    message: post.message,
    media: post.media,
    user: {
      _id: user._id,
      username: user.username,
      name: user.name,
      photo: user.photo,
    },
    replyCount: 0,
    likeCount: 0,
    viewCount: 0,
    saveCount: 0,
    retweetCount: 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };

  sendNewPostIO(obj);

  res.json({
    message: "Post created",
    data: obj,
  });
});

export default createPost;
