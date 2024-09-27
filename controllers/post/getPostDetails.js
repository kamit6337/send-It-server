import isUserLikePost from "../../database/Like/isUserLikePost.js";
import postDetails from "../../database/Post/postDetails.js";
import isUserSavePost from "../../database/Save/isUserSavePost.js";
import catchAsyncError from "../../utils/catchAsyncError.js";
import HandleGlobalError from "../../utils/HandleGlobalError.js";

const getPostDetails = catchAsyncError(async (req, res, next) => {
  const userId = req.userId;

  const { id } = req.query;

  if (!id) {
    return next(new HandleGlobalError("Id is not provided", 404));
  }

  const promises = [
    postDetails(id),
    isUserLikePost(userId, id),
    isUserSavePost(userId, id),
  ];

  const [post, liked, saved] = await Promise.all(promises);

  res.json({
    ...post,
    isLiked: liked,
    isSaved: saved,
  });
});

export default getPostDetails;
