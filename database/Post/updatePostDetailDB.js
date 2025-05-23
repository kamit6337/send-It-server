import PostDetail from "../../models/PostDetailModel.js";

const updatePostDetailDB = async (postId, obj) => {
  if (!postId || !obj) {
    throw new Error("PostId or Obj is not provided");
  }

  const post = await PostDetail.findOneAndUpdate(
    {
      post: postId,
    },
    {
      ...obj,
    },
    {
      new: true,
      runValidators: true,
    }
  ).lean();

  return post;
};

export default updatePostDetailDB;
