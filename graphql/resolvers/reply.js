import getRepliesByPostIdDB from "../../database/Reply/getRepliesByPostIdDB.js";
import createPostReply from "../../services/reply/createPostReply.js";

const replyResolvers = {
  Query: {
    getPostReplies: async (parent, args, { user, loaders }) => {
      const { postId, page } = args;

      const result = await getRepliesByPostIdDB(postId, page);
      return result;
    },
    getSingleReply: async (parent, args, { user, loaders }) => {
      const { postId } = args;
      return await loaders.postLoader.load(postId);
    },
  },
  Mutation: {
    createPostReply: createPostReply,
  },
};

export default replyResolvers;
