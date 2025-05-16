import createNewFollowing from "../../services/followers/createNewFollowing.js";
import getUserFollowers from "../../services/followers/getUserFollowers.js";
import getUserFollowings from "../../services/followers/getUserFollowings.js";
import removeSingleFollowing from "../../services/followers/removeSingleFollowing.js";

const followersResolvers = {
  Query: {
    getUserFollowers: getUserFollowers,
    getUserFollowings: getUserFollowings,
  },
  Mutation: {
    createNewFollowing: createNewFollowing,
    removeSingleFollowing: removeSingleFollowing,
  },
};

export default followersResolvers;
