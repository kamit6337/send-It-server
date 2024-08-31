import catchAsyncDBError from "../../utils/catchAsyncDBError.js";
import Post from "../../models/PostModel.js";
// import { setSingleUserPost } from "../../redis/User/userPosts.js";

const createNewPost = catchAsyncDBError(
  async (user, { message, media, duration, thumbnail }) => {
    const post = await Post.create({
      user: user._id,
      message,
      media,
      thumbnail,
      duration,
    });

    const obj = {
      _id: post._id,
      message: post.message,
      media: post.media,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        photo: user.photo,
      },
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    // await setSingleUserPost(obj);

    return obj;
  }
);

export default createNewPost;
