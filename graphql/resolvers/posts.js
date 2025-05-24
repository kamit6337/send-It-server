import Req from "../../lib/Req.js";
import createPost from "../../services/posts/createPost.js";
import deletePost from "../../services/posts/deletePost.js";
import getUserFollowingPosts from "../../services/posts/getUserFollowingPosts.js";
import updatePost from "../../services/posts/updatePost.js";

const postsResolvers = {
  Query: {
    getUserFollowingPosts: getUserFollowingPosts,
    getSinglePost: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      const { id } = args;
      const result = await loaders.postLoader.load(id);
      return result;
    },
    getPostDetails: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      const { id } = args;
      const result = await loaders.postDetailLoader.load(id);
      return result;
    },
  },
  Post: {
    user: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      return await loaders.userLoader.load(parent.user);
    },
    replyPost: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      if (!parent.replyPost) return null;

      return await loaders.postLoader.load(parent.replyPost);
    },
  },
  PostDetail: {
    isLiked: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      return await loaders.likeLoader.load({
        user: user._id,
        post: parent.post,
      });
    },
    isSaved: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      return await loaders.saveLoader.load({
        user: user._id,
        post: parent.post,
      });
    },
  },
  Mutation: {
    createPost: createPost,
    updatePost: updatePost,
    deletePost: deletePost,
  },
};
export default postsResolvers;
