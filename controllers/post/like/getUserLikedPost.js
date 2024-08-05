import catchAsyncError from "../../../utils/catchAsyncError.js";
import Like from "../../../models/LikeModel.js";

const getUserLikedPost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { page = 1 } = req.query;

  const limit = 20;
  const skip = (page - 1) * limit;

  const posts = await Like.find({
    user: userId,
  })
    .sort("-updatedAt")
    .skip(skip)
    .limit(limit)
    .populate({
      path: "post",
      populate: {
        path: "user",
        model: "User",
        select: "username name photo",
      },
    });

  res.json({
    message: "user liked posts",
    page,
    data: posts,
  });
});

export default getUserLikedPost;
