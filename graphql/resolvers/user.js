import getUserLikePosts from "../../services/user/getUserLikePosts.js";
import getUserMediaPosts from "../../services/user/getUserMediaPosts.js";
import getUserPosts from "../../services/user/getUserPosts.js";
import getUserProfile from "../../services/user/getUserProfile.js";
import getUserReplyPosts from "../../services/user/getUserReplyPosts.js";
import getUserSavePosts from "../../services/user/getUserSavePosts.js";
import getUserSearch from "../../services/user/getUserSearch.js";
import updateUserProfile from "../../services/user/updateUserProfile.js";

const userResolvers = {
  Query: {
    getUserProfile: getUserProfile,
    getUserPosts: getUserPosts,
    getUserMediaPosts: getUserMediaPosts,
    getUserReplyPosts: getUserReplyPosts,
    getUserLikePosts: getUserLikePosts,
    getUserSavePosts: getUserSavePosts,
    getUserSearch: getUserSearch,
  },
  Mutation: {
    updateUserProfile: updateUserProfile,
  },
};

export default userResolvers;
