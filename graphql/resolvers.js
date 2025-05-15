import { mergeResolvers } from "@graphql-tools/merge";
import authResolvers from "./resolvers/auth.js";
import filesResolvers from "./resolvers/files.js";
import postsResolvers from "./resolvers/posts.js";
import likeAndSaveResolvers from "./resolvers/likeAndSave.js";
import replyResolvers from "./resolvers/reply.js";
import userResolvers from "./resolvers/user.js";

const resolversArray = [
  authResolvers,
  filesResolvers,
  postsResolvers,
  likeAndSaveResolvers,
  replyResolvers,
  userResolvers,
];

const resolvers = mergeResolvers(resolversArray);

export default resolvers;
