import Post from "../../models/PostModel.js";

const getSingleReplyDB = async (postId) => {
  if (!postId) {
    throw new Error("PostId is not provided");
  }

  const reply = await Post.findOne({
    _id: postId,
  })
    .populate([
      {
        path: "user",
        select: "_id name email photo",
      },
      {
        path: "replyPostId",
        populate: {
          path: "user",
          select: "_id name email photo",
        },
      },
    ])
    .lean();

  return reply;
};

export default getSingleReplyDB;
