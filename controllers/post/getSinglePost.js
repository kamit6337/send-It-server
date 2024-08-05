import Post from "../../models/PostModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getSinglePost = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  const post = await Post.findOne({
    _id: id,
  }).populate({
    path: "user",
    select: "username name photo",
  });

  res.json({ message: "Single post", data: post });
});

export default getSinglePost;
