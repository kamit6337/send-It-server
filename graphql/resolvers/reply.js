import createPostReply from "../../services/reply/createPostReply.js";
import getPostReplies from "../../services/reply/getPostReplies.js";

const replyResolvers = {
  Query: {
    getPostReplies: getPostReplies,
  },
  Mutation: {
    createPostReply: createPostReply,
  },
};

export default replyResolvers;
