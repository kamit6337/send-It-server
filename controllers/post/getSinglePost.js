import singlePost from "../../database/Post/singlePost.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getSinglePost = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  const post = await singlePost(userId, id);

  res.json(post[0]);
});

export default getSinglePost;
