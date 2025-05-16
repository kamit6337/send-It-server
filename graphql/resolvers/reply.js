import createPostReply from "../../services/reply/createPostReply.js";
import getPostReplies from "../../services/reply/getPostReplies.js";
import getSingleReply from "../../services/reply/getSingleReply.js";

const replyResolvers = {
  Query: {
    getPostReplies: getPostReplies,
    getSingleReply: getSingleReply,
  },
  Mutation: {
    createPostReply: createPostReply,
  },
};

export default replyResolvers;
