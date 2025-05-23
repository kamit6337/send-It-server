import getTopFollowedUsersDB from "../../database/Follower/getTopFollowedUsersDB.js";
import getUserFollowersDB from "../../database/Follower/getUserFollowersDB.js";
import getUserFollowingsDB from "../../database/Follower/getuserFollowingsDB.js";
import createNewFollowing from "../../services/followers/createNewFollowing.js";
import removeSingleFollowing from "../../services/followers/removeSingleFollowing.js";

const followersResolvers = {
  Query: {
    getUserFollowers: async (parent, args, { user, loaders }) => {
      const { userId, page } = args;

      const result = await getUserFollowersDB(userId, page);
      return result;
    },
    getUserFollowings: async (parent, args, { user, loaders }) => {
      const { userId, page } = args;

      const result = await getUserFollowingsDB(userId, page);
      return result;
    },
    isCurrentUserFollow: async (parent, args, { user, loaders }) => {
      const { userId } = args;

      return await loaders.userFollowingLoader.load({
        user: userId,
        follower: user._id,
      });
    },
    getTopFollowedUsers: async (parent, args, { user, loaders }) => {
      const { page } = args;

      const results = await getTopFollowedUsersDB(user._id, page);
      return results;
    },
  },
  Top_Followed_User: {
    isFollowed: async (parent, args, { user, loaders }) => {
      return await loaders.userFollowingLoader.load({
        user: parent._id,
        follower: user._id,
      });
    },
  },
  Follower: {
    isFollowed: async (parent, args, { user, loaders }) => {
      return await loaders.userFollowingLoader.load({
        user: parent._id,
        follower: user._id,
      });
    },
  },
  Mutation: {
    createNewFollowing: createNewFollowing,
    removeSingleFollowing: removeSingleFollowing,
  },
};

export default followersResolvers;
