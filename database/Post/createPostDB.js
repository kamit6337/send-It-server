import Post from "../../models/PostModel.js";

const createPostDB = async (obj) => {
  if (!obj) {
    throw new Error("Obj is not provided");
  }

  const post = await Post.create({
    ...obj,
  });

  const modifyPost = JSON.parse(JSON.stringify(post));

  return modifyPost;
};

export default createPostDB;
