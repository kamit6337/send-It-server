import Post from "../../models/PostModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const createPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;
  const user = req.user;

  const { message = "", media = "" } = req.body;

  if (!message && !media) {
    return next(new HandleGlobalError("All fields is required", 404));
  }

  const post = await Post.create({
    user: userId,
    message,
    media,
  });

  const obj = {
    _id: post._id,
    message: post.message,
    media: post.media,
    user: {
      username: user.username,
      name: user.name,
      photo: user.photo,
    },
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };

  res.json({
    message: "Post created",
    data: obj,
  });
});

export default createPost;
