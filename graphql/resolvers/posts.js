import createPost from "../../services/posts/createPost.js";
import deletePost from "../../services/posts/deletePost.js";
import getPostDetails from "../../services/posts/getPostDetails.js";
import getSinglePost from "../../services/posts/getSinglePost.js";
import updatePost from "../../services/posts/updatePost.js";

const postsResolvers = {
  Query: {
    getSinglePost: getSinglePost,
    createPost: createPost,
    updatePost: updatePost,
    deletePost: deletePost,

    getPostDetails: getPostDetails,
  },
};
export default postsResolvers;
