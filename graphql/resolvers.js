import { mergeResolvers } from "@graphql-tools/merge";
import authResolvers from "./resolvers/auth.js";
import filesResolvers from "./resolvers/files.js";
import postsResolvers from "./resolvers/posts.js";

const resolversArray = [authResolvers, filesResolvers, postsResolvers];

const resolvers = mergeResolvers(resolversArray);

export default resolvers;
