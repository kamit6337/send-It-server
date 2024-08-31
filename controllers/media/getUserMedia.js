import userMediaPosts from "../../database/Post/userMediaPosts.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getUserMedia = catchAsyncError(async (req, res, next) => {
  const { page = 1, id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("user ID is not provided", 404));
  }

  const mediaPosts = await userMediaPosts(id, page);

  res.json(mediaPosts);
});

export default getUserMedia;
