import postDetails from "../../database/Post/postDetails.js";
import isUserReplyThisPost from "../../database/Reply/isUserReplyThisPost.js";
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
    isUserReplyThisPost(userId, id),
  ];

  const [post, liked, saved, reply] = await Promise.all(promises);

  res.json({
    message: "post detail",
    data: {
      ...post,
      isLiked: liked,
      isSaved: saved,
      isReply: reply,
    },
  });
});

export default getPostDetails;
