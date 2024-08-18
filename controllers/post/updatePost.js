import { io } from "../../app.js";
import Post from "../../models/PostModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const updatePost = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  const { id, message = "", media = "", duration, thumbnail } = req.body;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  if (!message && !media) {
    return next(new HandleGlobalError("All fields is required", 404));
  }

  const obj = {};

  if (message) obj.message = message;
  if (media) obj.media = media;
  if (duration) obj.duration = duration;
  if (thumbnail) obj.thumbnail = thumbnail;

  const post = await Post.findOneAndUpdate(
    {
      _id: id,
    },
    {
      ...obj,
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  const newObj = {
    ...post,
    user: {
      _id: user._id,
      username: user.username,
      name: user.name,
      photo: user.photo,
    },
  };

  io.emit("newPost", newObj);

  res.json({
    message: "Post updated",
  });
});

export default updatePost;
