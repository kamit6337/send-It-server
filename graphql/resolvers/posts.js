import createPost from "../../services/posts/createPost.js";
import deletePost from "../../services/posts/deletePost.js";
import getPostDetails from "../../services/posts/getPostDetails.js";
import getSinglePost from "../../services/posts/getSinglePost.js";
import getUserFollowingPosts from "../../services/posts/getUserFollowingPosts.js";
import updatePost from "../../services/posts/updatePost.js";

const postsResolvers = {
  Query: {
    getUserFollowingPosts: getUserFollowingPosts,
    getSinglePost: getSinglePost,
    getPostDetails: getPostDetails,
  },
  Mutation: {
    createPost: createPost,
    updatePost: updatePost,
    deletePost: deletePost,
  },
};
export default postsResolvers;
