import createUserFollowingLoader from "./Follower/createUserFollowingLoader.js";
import createLikeLoader from "./Like_and_Save/createLikeLoader.js";
import createSaveLoader from "./Like_and_Save/createSaveLoader.js";
import createPostDetailLoader from "./Post/createPostDetailLoader.js";
import createPostLoader from "./Post/createPostLoader.js";
import createPostRepliesLoader from "./Post/createPostRepliesLoader.js";
import createUserLoader from "./User/createUserLoader.js";

const createLoaders = () => ({
  userLoader: createUserLoader(),
  postLoader: createPostLoader(),
  userFollowingLoader: createUserFollowingLoader(),
  postDetailLoader: createPostDetailLoader(),
  likeLoader: createLikeLoader(),
  saveLoader: createSaveLoader(),
  postRepliesLoader: createPostRepliesLoader(),
});

export default createLoaders;
