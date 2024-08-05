import Like from "../../models/LikeModel.js";
import Post from "../../models/PostModel.js";
import Reply from "../../models/ReplyModel.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const deletePost = catchAsyncError(async (req, res, next) => {
  const { id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  const deleteAll = async () => {
    const promises = [
      Post.deleteOne({ _id: id }),
      Reply.deleteMany({
        $or: [{ post: id }, { replyPost: id }],
      }),
      Like.deleteMany({ post: id }),
    ];
    await Promise.all(promises);
  };

  let retries = 3;

  while (retries > 0) {
    try {
      await deleteAll();
      res.json({
        message: "Post is deleted",
        data: id,
      });
    } catch (error) {
      retries -= 1;
      if (retries === 0) {
        return next(
          new HandleGlobalError("Issue in deleteing post. Please try later")
        );
      }
    }
  }
});

export default deletePost;
