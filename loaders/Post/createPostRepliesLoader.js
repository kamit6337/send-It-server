import Post from "../../models/PostModel.js";
import DataLoader from "dataloader";

const createPostRepliesLoader = () =>
  new DataLoader(async (keys) => {
    // keys: [{ user, replyPost }, ...]

    const replyPostIds = [
      ...new Set(keys.map(({ replyPost }) => replyPost.toString())),
    ];
    const userIds = [...new Set(keys.map(({ user }) => user.toString()))];

    const posts = await Post.find({
      replyPost: { $in: replyPostIds },
      user: { $in: userIds },
    }).lean();

    // Map and group
    return keys.map(({ user, replyPost }) => {
      return posts.filter(
        (post) =>
          post.user?.toString() === user.toString() &&
          post.replyPost?.toString() === replyPost.toString()
      );
    });
  });

export default createPostRepliesLoader;
