import Post from "../../models/PostModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const updatePost = catchAsyncError(async (req, res, next) => {
  const { id, message = "", media = "" } = req.body;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  if (!message && !media) {
    return next(new HandleGlobalError("All fields is required", 404));
  }

  const obj = {};

  if (message) obj.message = message;
  if (media) obj.media = media;

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
  );

  res.json({
    message: "Post updated",
    data: post,
  });
});

export default updatePost;
