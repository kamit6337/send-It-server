import createPost from "../../services/posts/createPost.js";
import deletePost from "../../services/posts/deletePost.js";
import getUserFollowingPosts from "../../services/posts/getUserFollowingPosts.js";
import updatePost from "../../services/posts/updatePost.js";

const postsResolvers = {
  Query: {
    getUserFollowingPosts: getUserFollowingPosts,
    getSinglePost: async (parent, args, { user, loaders }) => {
      const { id } = args;
      const result = await loaders.postLoader.load(id);

      console.log("result", result);
      return result;
    },
    getPostDetails: async (parent, args, { user, loaders }) => {
      const { id } = args;
      return await loaders.postDetailLoader.load(id);
    },
  },
  Post: {
    user: async (parent, args, { user, loaders }) => {
      return await loaders.userLoader.load(parent.user);
    },
    replyPost: async (parent, args, { user, loaders }) => {
      return await loaders.postLoader.load(parent.replyPost);
    },
    isFollow: async (parent, args, { user, loaders }) => {
      const userId =
        typeof parent.user === "object" ? parent.user._id : parent.user;

      return await loaders.userFollowingLoader.load({
        user: userId,
        follower: user._id,
      });
    },
  },
  PostDetail: {
    isLiked: async (parent, args, { user, loaders }) => {
      return await loaders.likeLoader.load({
        user: user._id,
        post: parent.post,
      });
    },
    isSaved: async (parent, args, { user, loaders }) => {
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
