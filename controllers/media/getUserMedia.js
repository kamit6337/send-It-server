import Post from "../../models/PostModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getUserMedia = catchAsyncError(async (req, res, next) => {
  const { page = 1, id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("user ID is not provided", 404));
  }

  const limit = 20;
  const skip = (page - 1) * limit;

  const mediaPosts = await Post.find({
    user: id,
    ofReply: false,
    media: { $ne: "" },
  })
    .skip(skip)
    .limit(limit);

  res.json({
    message: "User media post",
    data: mediaPosts,
  });
});

export default getUserMedia;
