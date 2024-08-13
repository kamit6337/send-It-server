import Post from "../../../models/PostModel.js";
import catchAsyncError from "../../../utils/catchAsyncError.js";

const getUserPost = catchAsyncError(async (req, res, next) => {
  const { page = 1, id } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const posts = await Post.find({
    user: id,
    ofReply: false,
  })
    .sort("-createdAt")
    .skip(skip)
    .limit(limit)
    .populate({
      path: "user",
      select: "_id name username photo",
    });

  res.json({
    message: "user posts",
    page,
    data: posts,
  });
});

export default getUserPost;
