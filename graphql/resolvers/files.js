import getMediaUrl from "../../services/files/getMediaUrl.js";
import getMediaUrlForChats from "../../services/files/getMediaUrlForChats.js";
import getMediaUrlForPosts from "../../services/files/getMediaUrlForPosts.js";

const filesResolvers = {
  Query: {
    getMediaUrlForPosts: getMediaUrlForPosts,
    getMediaUrl: getMediaUrl,
    getMediaUrlForChats: getMediaUrlForChats,
  },
};

export default filesResolvers;
