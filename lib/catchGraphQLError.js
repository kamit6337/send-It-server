import { GraphQLError } from "graphql";

const catchGraphQLError = (fn) => {
  return (...args) => {
    try {
      return fn(...args);
    } catch (error) {
      throw new GraphQLError(error.message);
    }
  };
};

export default catchGraphQLError;
