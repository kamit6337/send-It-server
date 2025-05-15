import getUserLikePosts from "../../services/user/getUserLikePosts.js";
import getUserPosts from "../../services/user/getUserPosts.js";
import getUserProfile from "../../services/user/getUserProfile.js";
import getUserSavePosts from "../../services/user/getUserSavePosts.js";

const userResolvers = {
  Query: {
    getUserProfile: getUserProfile,
    getUserPosts: getUserPosts,
    getUserLikePosts: getUserLikePosts,
    getUserSavePosts: getUserSavePosts,
  },
};

export default userResolvers;
