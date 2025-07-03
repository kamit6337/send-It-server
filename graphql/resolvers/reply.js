import getRepliesByPostIdDB from "../../database/Reply/getRepliesByPostIdDB.js";
import Req from "../../lib/Req.js";
import createPostReply from "../../services/reply/createPostReply.js";

const replyResolvers = {
  Query: {
    getPostReplies: async (parent, args, { req, loaders }) => {
      const user = await Req(req);

      const { postId, page } = args;

      const result = await getRepliesByPostIdDB(postId, page);
      return result;
    },
    getSingleReply: async (parent, args, { req, user, authError, loaders }) => {
      if (!user) throw new Error(authError || "UnAuthorized");

      const { postId } = args;
      return await loaders.postLoader.load(postId);
    },
  },
  Mutation: {
    createPostReply: createPostReply,
  },
};

export default replyResolvers;
