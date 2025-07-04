import getTopFollowedUsersDB from "../../database/Follower/getTopFollowedUsersDB.js";
import getUserFollowersDB from "../../database/Follower/getUserFollowersDB.js";
import getUserFollowingsDB from "../../database/Follower/getUserFollowingsDB.js";
import Req from "../../lib/Req.js";
import createNewFollowing from "../../services/followers/createNewFollowing.js";
import removeSingleFollowing from "../../services/followers/removeSingleFollowing.js";

const followersResolvers = {
  Query: {
    getUserFollowers: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      const { userId, page } = args;

      const result = await getUserFollowersDB(userId, page);
      return result;
    },
    getUserFollowings: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      const { userId, page } = args;

      const result = await getUserFollowingsDB(userId, page);
      return result;
    },
    isCurrentUserFollow: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      const { userId } = args;

      return await loaders.userFollowingLoader.load({
        user: userId,
        follower: user._id,
      });
    },
    getTopFollowedUsers: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      const { page } = args;

      const results = await getTopFollowedUsersDB(user._id, page);
      return results;
    },
  },
  Top_Followed_User: {
    isFollowed: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      return await loaders.userFollowingLoader.load({
        user: parent._id,
        follower: user._id,
      });
    },
  },
  Follower: {
    isFollowed: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

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
