import updatePostLike from "../../services/like_and_save/updatePostLike.js";
import updatePostSave from "../../services/like_and_save/updatePostSave.js";

const likeAndSaveResolvers = {
  Mutation: {
    updatePostLike: updatePostLike,
    updatePostSave: updatePostSave,
  },
};

export default likeAndSaveResolvers;
