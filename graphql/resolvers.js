import { mergeResolvers } from "@graphql-tools/merge";
import authResolvers from "./resolvers/auth.js";

const resolversArray = [authResolvers];

const resolvers = mergeResolvers(resolversArray);

export default resolvers;
