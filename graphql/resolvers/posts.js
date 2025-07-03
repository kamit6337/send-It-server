import createPost from "../../services/posts/createPost.js";
import deletePost from "../../services/posts/deletePost.js";
import getUserFollowingPosts from "../../services/posts/getUserFollowingPosts.js";
import updatePost from "../../services/posts/updatePost.js";

const postsResolvers = {
  Query: {
    getUserFollowingPosts: getUserFollowingPosts,
    getSinglePost: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      const { id } = args;
      const result = await loaders.postLoader.load(id);
      return result;
    },
    getPostDetails: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      const { id } = args;
      const result = await loaders.postDetailLoader.load(id);
      return result;
    },
  },
  Following_Post: {
    replies: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      const findUser = user;

      const postId = parent._id;

      const result = await loaders.postRepliesLoader.load({
        user: findUser._id,
        replyPost: postId,
      });

      if (!result || result.length === 0) return [];

      return result;
    },
    replyPost: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      if (!parent.replyPost) return null;

      const post = await loaders.postLoader.load(parent.replyPost);
      return post;
    },
    user: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      return await loaders.userLoader.load(parent.user);
    },
  },
  Post: {
    user: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      return await loaders.userLoader.load(parent.user);
    },
    replyPost: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      if (!parent.replyPost) return null;

      return await loaders.postLoader.load(parent.replyPost);
    },
  },
  PostDetail: {
    isLiked: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      return await loaders.likeLoader.load({
        user: user._id,
        post: parent.post,
      });
    },
    isSaved: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

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
