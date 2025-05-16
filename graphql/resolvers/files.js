import getMediaUrlForImage from "../../services/files/getMediaUrlForImage.js";
import getMediaUrlForVideo from "../../services/files/getMediaUrlForVideo.js";

const filesResolvers = {
  Query: {
    getMediaUrlForImage: getMediaUrlForImage,
    getMediaUrlForVideo: getMediaUrlForVideo,
  },
};

export default filesResolvers;
