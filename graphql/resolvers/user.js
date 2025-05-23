import amIFollowThisUser from "../../database/Follower/amIFollowThisUser.js";
import userFollowersCount from "../../database/Follower/userFollowersCount.js";
import userFollowingsCount from "../../database/Follower/userFollowingsCount.js";
import getUserLikePostsDB from "../../database/Like/getUserLikePostsDB.js";
import getMediaPostsByUserIdDB from "../../database/Post/getMediaPostsByUserIdDB.js";
import getPostsByUserIdDB from "../../database/Post/getPostsByUserIdDB.js";
import userLikeCount from "../../database/Post_Details/userLikeCount.js";
import userMediaPostCount from "../../database/Post_Details/userMediaPostCount.js";
import userPostCount from "../../database/Post_Details/userPostCount.js";
import userReplyCount from "../../database/Post_Details/userReplyCount.js";
import userSavePostCount from "../../database/Post_Details/userSavePostCount.js";
import getRepliesByUserIdDB from "../../database/Reply/getRepliesByUserIdDB.js";
import getUserSavePostsDB from "../../database/Save/getUserSavePostsDB.js";
import getUserByEmail from "../../database/User/getUserByEmail.js";
import getUserSearch from "../../services/user/getUserSearch.js";
import updateUserProfile from "../../services/user/updateUserProfile.js";

const userResolvers = {
  Query: {
    getUserProfile: async (parent, args, { user, loaders }) => {
      const { email } = args;
      const userProfile = await getUserByEmail(email);
      return userProfile;
    },
    getUserPosts: async (parent, args, { user, loaders }) => {
      const { userId, page } = args;
      const result = await getPostsByUserIdDB(userId, page);
      return result;
    },
    getUserMediaPosts: async (parent, args, { user, loaders }) => {
      const { userId, page } = args;
      const result = await getMediaPostsByUserIdDB(userId, page);
      return result;
    },
    getUserLikePosts: async (parent, args, { user, loaders }) => {
      const { page } = args;

      const likes = await getUserLikePostsDB(user._id, page);

      if (likes.length === 0) return [];

      const postIds = likes.map((like) => like.post);

      const result = await loaders.postLoader.loadMany(postIds);

      return result;
    },
    getUserSavePosts: async (parent, args, { user, loaders }) => {
      const { page } = args;

      const saves = await getUserSavePostsDB(user._id, page);

      if (saves.length === 0) return [];

      const postIds = saves.map((like) => like.post);

      return await loaders.postLoader.loadMany(postIds);
    },
    getUserReplyPosts: async (parent, args, { user, loaders }) => {
      const { userId, page } = args;

      const posts = await getRepliesByUserIdDB(userId, page);

      if (posts.length === 0) return posts;

      const replyPostIds = [
        ...new Set(posts.map((post) => post.replyPost.toString())),
      ];

      const replyPosts = await loaders.postLoader.loadMany(replyPostIds);

      if (Array.isArray(replyPosts)) {
        return replyPosts.map((post) => ({
          ...post,
          userId, // <- attach the original userId from args
        }));
      }

      const result = [{ ...replyPosts, userId }];

      return result;
    },
    getUserSearch: getUserSearch,
  },
  Reply_Post_Replies: {
    replies: async (parent, args, { user, loaders }) => {
      const result = await loaders.postRepliesLoader.load({
        user: parent.userId || user._id,
        replyPost: parent._id,
      });

      if (!result || result.length === 0) return [];

      return result;
    },
    replyPost: async (parent, args, { user, loaders }) => {
      if (!parent.replyPost) return null;
      return await loaders.postLoader.load(parent.replyPost);
    },
    user: async (parent, args, { user, loaders }) => {
      return await loaders.userLoader.load(parent.user);
    },
  },
  UserProfile: {
    followersCount: async (parent, args, { user, loaders }) => {
      const followerCount = await userFollowersCount(parent._id);
      return followerCount;
    },
    followingCount: async (parent, args, { user, loaders }) => {
      const followingCount = await userFollowingsCount(parent._id);
      return followingCount;
    },
    isFollowed: async (parent, args, { user, loaders }) => {
      const findFollowing = await amIFollowThisUser(parent._id, user._id);
      return findFollowing;
    },
    userPosts: async (parent, args, { user, loaders }) => {
      const postCount = await userPostCount(parent._id);
      return postCount;
    },
    likePosts: async (parent, args, { user, loaders }) => {
      const likePostCount = await userLikeCount(parent._id);
      return likePostCount;
    },
    replyPosts: async (parent, args, { user, loaders }) => {
      const replyPostCount = await userReplyCount(parent._id);
      return replyPostCount;
    },
    mediaPosts: async (parent, args, { user, loaders }) => {
      const mediaPostCount = await userMediaPostCount(parent._id);
      return mediaPostCount;
    },
    savePosts: async (parent, args, { user, loaders }) => {
      const savePostCount = await userSavePostCount(parent._id);
      return savePostCount;
    },
  },
  Mutation: {
    updateUserProfile: updateUserProfile,
  },
};

export default userResolvers;
